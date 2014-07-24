app.directive('auth', function(authService, $location, layoutService) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            "use strict";

            scope.infos = [];

            scope.homeButtonVisible = layoutService.homeButtonVisible;

            scope.setLocationHome = function () {
                $location.path('');
            };

            scope.user = {
                username : "",
                password : "",
                signedId : false
            };

            scope.loader = {
                isLoading: false
            };

            signIn();

            function signIn() {
                scope.loader.isLoading = true;
                var userMePromise = authService.authenticate(scope.user.username, scope.user.password);

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
                        scope.infos.push({type: 'danger', msg:'Wrong credentials'});
                    } else {
                        scope.infos.push({type: 'danger', msg:'Server error'});
                    }
                });
            }

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.signIn = signIn;

            scope.signOut = function() {
                authService.signOut();
                scope.user = {};
                /*scope.user.username = "";
                scope.user.password = "";
                scope.user.signedIn = false;*/
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