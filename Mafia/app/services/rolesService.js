var AFFILIATION_ID_CITIZENS = 1;
var AFFILIATION_ID_MAFIA = 2;

var ROLE_ID_CITIZEN = 1;
var ROLE_ID_DOCTOR = 2;
var ROLE_ID_DETECTIVE = 3;
var ROLE_ID_MOB = 4;
var ROLE_ID_SHERIFF = 5;
var ROLE_ID_TELLER = 6;
var ROLE_ID_TERRORIST = 7;
var ROLE_ID_JOURNALIST = 8;
var ROLE_ID_FUGITIVE = 9;
var ROLE_ID_DEPUTY = 10;
var ROLE_ID_ELDER = 11;
var ROLE_ID_NECROMANCER = 12;
var ROLE_ID_ZOMBIE = 13;
var ROLE_ID_FORGER = 14;


app.factory('rolesService', function(serverService, $q) {
    "use strict";

    var affiliationIds = {
        AFFILIATION_ID_CITIZENS : AFFILIATION_ID_CITIZENS,
        AFFILIATION_ID_MAFIA : AFFILIATION_ID_MAFIA
    };

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
        ROLE_ID_DEPUTY : ROLE_ID_DEPUTY,
        ROLE_ID_ELDER : ROLE_ID_ELDER,
        ROLE_ID_NECROMANCER : ROLE_ID_NECROMANCER,
        ROLE_ID_ZOMBIE : ROLE_ID_ZOMBIE,
        ROLE_ID_FORGER : ROLE_ID_FORGER
    };

    var allRoles;
    var allRolesPromise;

    var getAllRoles = function(refresh) {
        var deferred = $q.defer();

        if (!allRoles || refresh) {
            if (!allRolesPromise) {
                allRolesPromise = serverService.get('roles',{});
                allRolesPromise = allRolesPromise.then(function(allRolesResult) {
                    allRoles = allRolesResult;
                    return allRolesResult;
                });
            }
            return allRolesPromise;
        } else {
            deferred.resolve(allRoles);
        }
        return deferred.promise;
    };

    var getAllRolesByIds = function(refresh) {
        var allRolesPromise = getAllRoles(refresh);
        return allRolesPromise.then(function(allRolesResult) {
            var allRolesByIds = {};
            angular.forEach(allRolesResult, function(someRole) {
                allRolesByIds[someRole.id] = someRole;
            });
            return allRolesByIds;
        });
    };

    return {
        affiliationIds : affiliationIds,
        roleIds : roleIds,
        allRoles : allRoles,
        getAllRoles : getAllRoles,
        getAllRolesByIds : getAllRolesByIds
    };
});