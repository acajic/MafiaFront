app.factory('appRolesService', function($q, serverService) {
    "use strict";


    var allAppRolesPromise;

    var getAllAppRoles = function(refresh) {
        var deferred = $q.defer();

        if (!allAppRolesPromise) {
            allAppRolesPromise = serverService.get('app_roles');
        }

        return allAppRolesPromise.then(function(appRolesResult) {
            return appRolesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllAppRolesByIds = function(refresh) {
        var allAppRolesPromise = getAllAppRoles(refresh);
        return allAppRolesPromise.then(function(allAppRolesResult) {
            var allAppRolesByIds = {};
            angular.forEach(allAppRolesResult, function(someAppRole) {
                allAppRolesByIds[someAppRole.id] = someAppRole;
            });
            return allAppRolesByIds;
        });
    };


    var getAllInitialAppRoles = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var initialAppRolesPromise = serverService.get('initial_app_roles', {
            page_index: pageIndex,
            page_size: pageSize,
            description: queryModel.description,
            created_at_min: queryModel.createdAtMin,
            created_at_max: queryModel.createdAtMax,
            updated_at_min: queryModel.updatedAtMin,
            updated_at_max: queryModel.updatedAtMax
        });


        return initialAppRolesPromise.then(function(initialAppRolesResult) {
            return initialAppRolesResult;
        }, function(reason) {
            return reason;
        });

    };

    return {
        getAllAppRoles : getAllAppRoles,
        getAllAppRolesByIds: getAllAppRolesByIds,
        getAllInitialAppRoles : getAllInitialAppRoles
    };
});