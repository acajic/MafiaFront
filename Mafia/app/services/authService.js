var URL_USERS_ME = 'users/me';
var URL_LOGIN = 'login';

app.factory('authService', function(serverService, $q) {
    "use strict";

    var user = {};



    var authenticate = function(username, password) {
        var deferred = $q.defer();

        if (username && password) {
            var userMePromise = serverService.post(URL_LOGIN, {username:username,password:password});

            userMePromise = userMePromise.then(function(userMe) {
                angular.copy(userMe, user);
                serverService.setAuthToken(userMe.auth_token.token_string, userMe.auth_token.expiration_date);
                return userMe;
            });

            return userMePromise;


        } else {

            if (serverService.getAuthToken()) {
                return this.userMe(false);
            } else {

                // user will have to enter credentials if they want access
                deferred.reject('Method "authService.authenticate": Neither credentials provided nor cookie present.');

            }

            return deferred.promise;
        }
    };

    var exchangeEmailConfirmationCode = function(emailConfirmationCode) {
        var userMePromise = serverService.post('exchange_email_confirmation_code', {email_confirmation_code : emailConfirmationCode});

        userMePromise = userMePromise.then(function(userMe) {
            angular.copy(userMe, user);
            serverService.setAuthToken(userMe.auth_token.token_string, userMe.auth_token.expiration_date);
            return userMe;
        });

        return userMePromise;
    };

    var userMe = function(refresh) {
        var deferred = $q.defer();

        if (serverService.getAuthToken()) {
            if (refresh || !user.id) {
                var userMePromise = serverService.get(URL_USERS_ME,null);

                userMePromise.then(function(userMe) {
                    angular.copy(userMe, user);
                    return userMe;
                }, function(reason) {
                    angular.copy({}, user);
                    return reason;
                });

                return userMePromise;

            } else {
                deferred.resolve(user);
            }
        } else {
            angular.copy({}, user);
            deferred.reject('Cookie token does not exist.');
        }

        return deferred.promise;
    };

    var notifications = {
        shouldSignOut: false
    };

    var signOut = function() {
        angular.copy({}, user);
        serverService.setAuthToken("", null);
    };

    return {
        user: user,
        authenticate: authenticate,
        exchangeEmailConfirmationCode: exchangeEmailConfirmationCode,
        userMe: userMe,
        notifications: notifications,
        signOut: signOut
    };
});