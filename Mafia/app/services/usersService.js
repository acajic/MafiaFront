var APP_PERMISSION_PARTICIPATE = 1;
var APP_PERMISSION_CREATE_GAMES = 2;
var APP_PERMISSION_ADMIN_READ = 3;
var APP_PERMISSION_ADMIN_WRITE = 4;

app.factory('usersService', function($q, serverService) {
    "use strict";


    // var allUsersByIds = {};

    var getAllUsers = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var allUsersPromise = serverService.get('users', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            email: queryModel.email,
            app_role_ids : queryModel.appRoleIds,
            email_confirmed: queryModel.emailConfirmed,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });
        /*
        allUsersPromise.then(function(allUsersResult) {
            angular.forEach(allUsersResult, function(someUser) {
                allUsersByIds[someUser.id] = someUser;
            });
            return allUsersResult;
        });
        */
        return allUsersPromise;
    };

    var getUserById = function(userId) {
        return serverService.get('users/'+userId, {});
    };

    var createUser = function(user) {
        return serverService.post('users', {user: user});
    };

    var updateUser = function(user) {
        return serverService.put('users/'+user.id, {
            user: user
        });
    };

    var deleteUserById = function(userId, password) {
        return serverService.delete('users/'+userId, {password: password});
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

    var userDeleted;

    return {
        // allUsersByIds: allUsersByIds,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createUser : createUser,
        updateUser : updateUser,
        deleteUserById : deleteUserById,
        userDeleted : userDeleted,
        allowedEmailPatterns: allowedEmailPatterns,
        getAllowedEmailPatterns : getAllowedEmailPatterns

    };
});