app.directive('auth', function($routeParams, authService, $location, layoutService) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            "use strict";

            scope.infos = [];

            scope.homeButtonVisible = layoutService.homeButtonVisible;

            scope.adminButtonVisible = function() {
                if (scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE] || scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                    return layoutService.adminButtonVisible();
                } else {
                    return false;
                }
            };

            scope.setLocationHome = function () {
                $location.path('');
            };

            scope.setLocationAdmin = function () {
                $location.path('/admin');
            };

            scope.user = {
                username : "",
                password : "",
                signedId : false
            };

            scope.loader = {
                isLoading: false
            };

            scope.$watch('user', function(newUser) {
                if (newUser['emailConfirmationCode']) {
                    if (!newUser.signedIn)
                        signIn();
                }
            }, true);

            signIn();

            function signIn() {
                scope.loader.isLoading = true;
                var userMePromise;
                if (scope.user['emailConfirmationCode']) {
                    var emailConfirmationCode = scope.user['emailConfirmationCode'];
                    scope.user['emailConfirmationCode'] = null;
                    userMePromise = authService.exchangeEmailConfirmationCode(emailConfirmationCode);
                } else {
                    userMePromise = authService.authenticate(scope.user.username, scope.user.password);
                }

                userMePromise.then(function(userMe) {

                    scope.user = userMe;
                    scope.user.signedIn = true;
                    scope.user.password = "";

                    scope.loader.isLoading = false;

                }, function(reason) {
                    scope.user.signedIn = false;
                    scope.loader.isLoading = false;

                    if (!reason.httpObj)
                        return;

                    if (reason.httpObj.status == 401) {
                        if (reason.httpObj.responseText) {
                            scope.infos.push({type: 'danger', msg:reason.httpObj.responseText});
                        } else {
                            scope.infos.push({type: 'danger', msg:'Server error'});
                        }


                    } else {
                        scope.infos.push({type: 'danger', msg:'Server error'});
                    }
                });
            }

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.signIn = signIn;

            scope.notifications = authService.notifications;

            scope.$watch('notifications.shouldSignOut', function(newValue, oldValue) {
                if (newValue && !oldValue) {
                    authService.notifications.shouldSignOut = false;
                    scope.signOut();
                }
            });

            scope.$watch('notifications.shouldSignIn', function(newValue, oldValue) {
                if (newValue && !oldValue) {
                    authService.notifications.shouldSignIn = false;
                    signIn();
                }
            });

            scope.signOut = function() {
                authService.signOut();
                scope.user = {};
                $location.path('/cities');
            };

            $(document).keypress(function(e) {
                if (e.which == 13 && $("#password").is(":focus")) {
                    scope.signIn();
                }
            });

            scope.register = function() {
                $location.path('/register');
            };
        },
        templateUrl: 'app/directiveTemplates/auth.html'
    };
});