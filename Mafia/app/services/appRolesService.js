var APP_ROLE_SUPER_ADMIN = 1;
var APP_ROLE_ADMIN = 2;
var APP_ROLE_GAME_CREATOR = 3;
var APP_ROLE_USER = 4;

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
            email: queryModel.email,
            email_pattern: queryModel.emailPattern,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return initialAppRolesPromise.then(function(initialAppRolesResult) {
            return initialAppRolesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllGrantedAppRoles = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var grantedAppRolesPromise = serverService.get('granted_app_roles', {
            page_index: pageIndex,
            page_size: pageSize,
            subscription_purchase_id: queryModel.subscriptionPurchaseId,
            description: queryModel.description,
            username: queryModel.username,
            email: queryModel.email,
            appRoleIds: queryModel.appRoleIds,
            expiration_date_min: queryModel.expirationDateMin,
            expiration_date_max: queryModel.expirationDateMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return grantedAppRolesPromise;
    };

    var getInitialAppRoleByIdPromisesByIds = {};
    var getInitialAppRoleById = function(initialAppRoleId, refresh) {
        if (!refresh && getInitialAppRoleByIdPromisesByIds[initialAppRoleId]) {
            return getInitialAppRoleByIdPromisesByIds[initialAppRoleId];
        }

        var initialAppRolePromise = serverService.get('initial_app_roles/' + initialAppRoleId);
        getInitialAppRoleByIdPromisesByIds[initialAppRoleId] = initialAppRolePromise;
        return initialAppRolePromise.then(function(initialAppRoleResult) {
            return initialAppRoleResult;
        });
    };

    var getGrantedAppRoleByIdPromisesByIds = {};
    var getGrantedAppRoleById = function(grantedAppRoleId, refresh) {
        if (!refresh && getGrantedAppRoleByIdPromisesByIds[grantedAppRoleId]) {
            return getInitialAppRoleByIdPromisesByIds[grantedAppRoleId];
        }

        var grantedAppRolePromise = serverService.get('granted_app_roles/' + grantedAppRoleId);
        getGrantedAppRoleByIdPromisesByIds[grantedAppRoleId] = grantedAppRolePromise;
        return grantedAppRolePromise;
    };

    var getNewInitialAppRole = function() {
        return serverService.get('initial_app_roles/new');
    };
    var getNewGrantedAppRole = function() {
        return serverService.get('granted_app_roles/new');
    };

    var postCreateInitialAppRole = function(initialAppRole) {
        return serverService.post('initial_app_roles', {initial_app_role : initialAppRole});
    };
    var postCreateGrantedAppRole = function(grantedAppRole) {
        return serverService.post('granted_app_roles', {granted_app_role : grantedAppRole});
    };

    var putUpdateInitialAppRole = function(initialAppRole) {
        return serverService.put('initial_app_roles/' + initialAppRole.id, {
            initial_app_role: initialAppRole
        });
    };
    var putUpdateGrantedAppRole = function(grantedAppRole) {
        return serverService.put('granted_app_roles/' + grantedAppRole.id, {
            granted_app_role: grantedAppRole
        });
    };

    var deleteInitialAppRole = function(initialAppRoleId) {
        return serverService.delete('initial_app_roles/' + initialAppRoleId);
    };
    var deleteGrantedAppRole = function(grantedAppRoleId) {
        return serverService.delete('granted_app_roles/' + grantedAppRoleId);
    };

    var notifications = {
        initialAppRoleCreated : null,
        initialAppRoleDeleted : null,
        grantedAppRoleCreated : null,
        grantedAppRoleDeleted : null
    };

    return {
        getAllAppRoles : getAllAppRoles,
        getAllAppRolesByIds: getAllAppRolesByIds,
        getAllInitialAppRoles : getAllInitialAppRoles,
        getAllGrantedAppRoles: getAllGrantedAppRoles,
        getInitialAppRoleById : getInitialAppRoleById,
        getGrantedAppRoleById: getGrantedAppRoleById,
        getNewInitialAppRole : getNewInitialAppRole,
        getNewGrantedAppRole: getNewGrantedAppRole,
        postCreateInitialAppRole : postCreateInitialAppRole,
        postCreateGrantedAppRole: postCreateGrantedAppRole,
        putUpdateInitialAppRole : putUpdateInitialAppRole,
        putUpdateGrantedAppRole: putUpdateGrantedAppRole,
        deleteInitialAppRole: deleteInitialAppRole,
        deleteGrantedAppRole: deleteGrantedAppRole,
        notifications: notifications
    };
});