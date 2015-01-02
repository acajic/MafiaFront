var PAYMENT_TYPE_UNKNOWN = 1;
var PAYMENT_TYPE_SUBSCRIPTION_1_MONTH = 2;
var PAYMENT_TYPE_SUBSCRIPTION_1_YEAR = 3;
var PAYMENT_TYPE_BUY_1_GAME = 4;
var PAYMENT_TYPE_BUY_5_GAMES = 5;
var PAYMENT_TYPE_BUY_1_ROLE_PICK = 6;
var PAYMENT_TYPE_BUY_5_ROLE_PICKS = 7;

app.factory('paymentsService', function($q, serverService) {
    "use strict";

    var paymentTypes = {
        PAYMENT_TYPE_UNKNOWN : PAYMENT_TYPE_UNKNOWN,
        PAYMENT_TYPE_SUBSCRIPTION_1_MONTH : PAYMENT_TYPE_SUBSCRIPTION_1_MONTH,
        PAYMENT_TYPE_SUBSCRIPTION_1_YEAR : PAYMENT_TYPE_SUBSCRIPTION_1_YEAR,
        PAYMENT_TYPE_BUY_1_GAME : PAYMENT_TYPE_BUY_1_GAME,
        PAYMENT_TYPE_BUY_5_GAMES : PAYMENT_TYPE_BUY_5_GAMES,
        PAYMENT_TYPE_BUY_1_ROLE_PICK : PAYMENT_TYPE_BUY_1_ROLE_PICK,
        PAYMENT_TYPE_BUY_5_ROLE_PICKS : PAYMENT_TYPE_BUY_5_ROLE_PICKS
    };

    var getAllPayments = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('payments/payments', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            city_name: queryModel.cityName,
            payment_type_ids: queryModel.paymentTypeIds,
            unit_price_min: queryModel.unitPriceMin,
            unit_price_max: queryModel.unitPriceMax,
            quantity_min: queryModel.quantityMin,
            quantity_max: queryModel.quantityMax,
            total_price_min: queryModel.totalPriceMin,
            total_price_max: queryModel.totalPriceMax,
            is_payment_valid: queryModel.isPaymentValid,
            info_json: queryModel.infoJson,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };

    var getAllPaymentTypes = function () {
        return serverService.get('payments/payment_types');
    };

    var postPayment = function(userId, paymentType, unitPrice, quantity, infoJson, valid) {
        return serverService.post('payments/payments', {
            payment_log : {
                user_id: userId,
                payment_type: paymentType,
                unit_price: unitPrice,
                quantity: quantity,
                info_json: infoJson,
                valid: valid
            }
        });
    };

    return {
        paymentTypes: paymentTypes,
        getAllPayments: getAllPayments,
        getAllPaymentTypes: getAllPaymentTypes,
        postPayment: postPayment
    };
});
