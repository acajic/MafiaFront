var APP_PERMISSION_PARTICIPATE = 1;
var APP_PERMISSION_CREATE_GAMES = 2;

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

    return {
        allUsers: allUsers,
        getAllUsers: getAllUsers,
        createUser : createUser,
        updateUser : updateUser
    };
});