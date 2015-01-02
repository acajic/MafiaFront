var SUBSCRIPTION_TYPE_1_MONTH = 1;
var SUBSCRIPTION_TYPE_1_YEAR = 2;

app.factory('subscriptionsService', function($q, serverService) {
    "use strict";

    var subscriptionTypes = {};
    subscriptionTypes[SUBSCRIPTION_TYPE_1_MONTH] = {
        id: SUBSCRIPTION_TYPE_1_MONTH,
        name: '1 Month Subscription'
    };
    subscriptionTypes[SUBSCRIPTION_TYPE_1_YEAR] = {
        id: SUBSCRIPTION_TYPE_1_YEAR,
        name: '1 Year Subscription'
    };


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


    var postSubscription = function() {
        return serverService.post('purchases/subscription_purchases', {
            subscription_purchase : {

            }
        });
    };

    return {
        subscriptionTypes: subscriptionTypes,
        getAllSubscriptions: getAllSubscriptions,
        postSubscription: postSubscription
    };
});
