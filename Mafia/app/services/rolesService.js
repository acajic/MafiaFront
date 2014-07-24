var ROLE_ID_CITIZEN = 1;
var ROLE_ID_DOCTOR = 2;
var ROLE_ID_DETECTIVE = 3;
var ROLE_ID_MOB = 4;
var ROLE_ID_SHERIFF = 5;
var ROLE_ID_TELLER = 6;
var ROLE_ID_TERRORIST = 7;
var ROLE_ID_JOURNALIST = 8;
var ROLE_ID_FUGITIVE = 9;
var ROLE_ID_SILENT_SHERIFF = 10;

app.factory('rolesService', function(serverService, $q) {
    "use strict";

    var roleIds = {
         ROLE_ID_CITIZEN : ROLE_ID_CITIZEN,
         ROLE_ID_DOCTOR : ROLE_ID_DOCTOR,
         ROLE_ID_DETECTIVE : ROLE_ID_DETECTIVE,
         ROLE_ID_MOB : ROLE_ID_MOB,
         ROLE_ID_SHERIFF : ROLE_ID_SHERIFF,
         ROLE_ID_TELLER : ROLE_ID_TELLER,
         ROLE_ID_TERRORIST : ROLE_ID_TERRORIST,
        ROLE_ID_JOURNALIST : ROLE_ID_JOURNALIST,
        ROLE_ID_FUGITIVE : ROLE_ID_FUGITIVE,
        ROLE_ID_SILENT_SHERIFF : ROLE_ID_SILENT_SHERIFF
    };

    var allRoles;

    var getAllRoles = function(refresh) {
        var deferred = $q.defer();

        if (!allRoles || refresh) {
            return serverService.get('roles',{});
        } else {
            deferred.resolve(allRoles);
        }
        return deferred.promise;
    };

    return {
        roleIds : roleIds,
        allRoles : allRoles,
        getAllRoles : getAllRoles
    };
});