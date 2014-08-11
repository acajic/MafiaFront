var APP_PERMISSION_PARTICIPATE = 1;
var APP_PERMISSION_CREATE_GAMES = 2;
var APP_PERMISSION_ADMIN_READONLY = 3;
var APP_PERMISSION_ADMIN_RW = 4;

app.factory('usersService', function($q, serverService) {
    "use strict";


    var allUsers = [];

    var getAllUsers = function() {
        var allUsersPromise = serverService.get('users');
        allUsersPromise.then(function(allUsersResult) {
            allUsers = allUsersResult;
        });
        return allUsersPromise;
    };

    var createUser = function(user) {
        return serverService.post('users', {user: user});
    };

    var updateUser = function(user) {
        return serverService.put('users/'+user.id, {
            user: user
        });
    };

    var allowedEmailPatterns = [];

    var getAllowedEmailPatterns = function(refresh) {
        if (!allowedEmailPatterns || allowedEmailPatterns.length == 0 || refresh) {
            var allowedEmailPatternsPromise = serverService.get('users/allowed_email_patterns');
            allowedEmailPatternsPromise.then(function(allowedEmailPatternsResult) {
                allowedEmailPatterns = allowedEmailPatternsResult;
            });
            return allowedEmailPatternsPromise;
        } else {
            var deferred = $q.defer();

            deferred.resolve(allowedEmailPatterns);

            return deferred.promise;
        }
    };

    return {
        allUsers: allUsers,
        getAllUsers: getAllUsers,
        createUser : createUser,
        updateUser : updateUser,
        allowedEmailPatterns: allowedEmailPatterns,
        getAllowedEmailPatterns : getAllowedEmailPatterns
    };
});