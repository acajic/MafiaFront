var SUBSCRIPTION_TYPE_1_MONTH = 1;
var SUBSCRIPTION_TYPE_1_YEAR = 2;

app.factory('subscriptionsService', function($q, serverService) {
    "use strict";

    var subscriptionTypes = [{
        id: SUBSCRIPTION_TYPE_1_MONTH,
        name: '1 Month Subscription'
    },
    {
        id: SUBSCRIPTION_TYPE_1_YEAR,
        name: '1 Year Subscription'
    }];


    var getAllSubscriptions = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/subscription_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            subscription_types: queryModel.subscriptionTypes,
            expiration_date_min: queryModel.expirationDateMin ? queryModel.expirationDateMin.getTime()/1000 : null,
            expiration_date_max: queryModel.expirationDateMax ? queryModel.expirationDateMax.getTime()/1000 : null,
            active: queryModel.active,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };


    var getSubscriptionPurchaseById = function (subscriptionPurchaseId) {
        return serverService.get('purchases/subscription_purchases/' + subscriptionPurchaseId);
    };

    var getNewSubscriptionPurchase = function () {
        return serverService.get('purchases/subscription_purchases/new');
    };

    var postCreateSubscriptionPurchase = function(subscriptionPurchase) {
        return serverService.post('purchases/subscription_purchases', {
            subscription_purchase : subscriptionPurchase
        });
    };

    var putUpdateSubscriptionPurchase = function(subscriptionPurchaseId, subscriptionPurchase) {
        return serverService.put('purchases/subscription_purchases/' + subscriptionPurchaseId, {
            subscription_purchase: subscriptionPurchase
        });
    };

    var deleteSubscriptionPurchase = function (subscriptionPurchaseId) {
        return serverService.delete('purchases/subscription_purchases/' + subscriptionPurchaseId);
    };

    var notifications = {
        subscriptionPurchaseCreated : null,
        subscriptionPurchaseDeleted : null
    };

    return {
        subscriptionTypes: subscriptionTypes,
        getAllSubscriptions: getAllSubscriptions,
        getSubscriptionPurchaseById: getSubscriptionPurchaseById,
        getNewSubscriptionPurchase: getNewSubscriptionPurchase,
        postCreateSubscriptionPurchase: postCreateSubscriptionPurchase,
        putUpdateSubscriptionPurchase: putUpdateSubscriptionPurchase,
        deleteSubscriptionPurchase: deleteSubscriptionPurchase,
        notifications: notifications

    };
});
