app.directive('auth', function($routeParams, $location, $modal, $timeout, authService, layoutService, usersService) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            "use strict";

            scope.infos = [];

            scope.homeButtonVisible = layoutService.homeButtonVisible;

            scope.profileUrl = "#!/profile";

            scope.adminButtonVisible = function() {
                if (scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_WRITE] || scope.user.app_role.app_permissions[APP_PERMISSION_ADMIN_READ]) {
                    return layoutService.adminButtonVisible();
                } else {
                    return false;
                }
            };

            scope.setLocationHome = function () {
                $location.path('/cities');
            };

            scope.setLocationAdmin = function () {
                $location.path('/admin');
            };

            scope.user = {
                username : "",
                password : ""
            };

            scope.loader = {
                isLoading: false
            };

            scope.$watch('user', function(newUser) {
                if (newUser['emailConfirmationCode']) {
                    if (!newUser.id)
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
                    scope.user.password = "";

                    scope.loader.isLoading = false;

                }, function(reason) {
                    scope.user.id = null;
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
                        // do nothing
                        // no users stored in cookies, no username&password
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


            scope.forgotPassword = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'forgotPasswordModalContent.html',
                    controller: ForgotPasswordModalInstanceCtrl,
                    resolve: {
                    }
                });

                modalInstance.result.then(function (email) {
                    if (!email || email.length == 0) {
                        scope.infos.push({type: 'danger', msg: 'Email must not be empty.'});
                        return;
                    }


                    var forgotPasswordPromise = usersService.postForgotPassword(email);
                    scope.loader.isLoading = true;
                    forgotPasswordPromise.then(function() {
                        $timeout(function() {
                            scope.infos.push({type : 'success', msg: 'Confirmation email sent to "' + email + '".'});
                            scope.loader.isLoading = false;
                        });

                    }, function(reason) {
                        $timeout(function() {
                            scope.loader.isLoading = false;
                            scope.infos.push({type : 'danger', msg: 'Failed to send confirmation email to "' + email +'".' });
                        });
                    });

                }, function () {
                });
            };





            var ForgotPasswordModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.form = {
                    email : ""
                };

                $scope.ok = function () {
                    $modalInstance.close($scope.form.email);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };


        },
        templateUrl: 'app/directiveTemplates/auth.html'
    };
});