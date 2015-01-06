app.factory('rolePickPurchasesService', function($q, serverService) {
    "use strict";


    var getAllRolePickPurchases = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/role_pick_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            role_ids: queryModel.roleIds,
            is_fulfilled: queryModel.isFulfilled,
            city_name: queryModel.cityName,
            city_started_at_min: queryModel.cityStartedAtMin,
            city_started_at_max: queryModel.cityStartedAtMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };


    var getRolePickPurchaseById = function (rolePickPurchaseId) {
        return serverService.get('purchases/role_pick_purchases/' + rolePickPurchaseId);
    };

    var getNewRolePickPurchase = function () {
        return serverService.get('purchases/role_pick_purchases/new');
    };

    var postCreateRolePickPurchase = function(rolePickPurchase) {
        return serverService.post('purchases/role_pick_purchases', {
            role_pick_purchase : rolePickPurchase
        });
    };


    var putUpdateRolePickPurchase = function(rolePickPurchaseId, rolePickPurchase) {
        return serverService.put('purchases/role_pick_purchases/' + rolePickPurchaseId, {
            role_pick_purchase: rolePickPurchase
        });
    };

    var deleteRolePickPurchase = function (rolePickPurchaseId) {
        return serverService.delete('purchases/role_pick_purchases/' + rolePickPurchaseId);
    };

    var notifications = {
        rolePickPurchaseCreated : null,
        rolePickPurchaseDeleted : null
    };

    return {
        getAllRolePickPurchases: getAllRolePickPurchases,
        getRolePickPurchaseById: getRolePickPurchaseById,
        getNewRolePickPurchase: getNewRolePickPurchase,
        postCreateRolePickPurchase: postCreateRolePickPurchase,
        putUpdateRolePickPurchase: putUpdateRolePickPurchase,
        deleteRolePickPurchase: deleteRolePickPurchase,
        notifications: notifications
    };
});
