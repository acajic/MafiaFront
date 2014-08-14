app.factory('appRolesService', function($q, serverService) {
    "use strict";



    var getAllAppRoles = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var appRolesPromise = serverService.get('app_roles', {
            page_index: pageIndex,
            page_size: pageSize,
            name: queryModel.name,
            created_at_min: queryModel.createdAtMin,
            created_at_max: queryModel.createdAtMax,
            updated_at_min: queryModel.updatedAtMin,
            updated_at_max: queryModel.updatedAtMax
        });


        return appRolesPromise.then(function(appRolesResult) {
            return appRolesResult;
        }, function(reason) {
            return reason;
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
        getAllInitialAppRoles : getAllInitialAppRoles
    };
});