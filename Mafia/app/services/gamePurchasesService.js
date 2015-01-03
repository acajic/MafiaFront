app.factory('gamePurchasesService', function($q, serverService) {
    "use strict";


    var getAllGamePurchases = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('purchases/game_purchases', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            user_email: queryModel.userEmail,
            used: queryModel.used,
            city_name: queryModel.cityName,
            city_started_at_min: queryModel.cityStartedAtMin ? queryModel.cityStartedAtMin.getTime()/1000 : null,
            city_started_at_max: queryModel.cityStartedAtMax ? queryModel.cityStartedAtMax.getTime()/1000 : null,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };


    var postGamePurchase = function() {
        return serverService.post('purchases/game_purchases', {
            game_purchase : {

            }
        });
    };

    return {
        getAllGamePurchases: getAllGamePurchases,
        postGamePurchase: postGamePurchase
    };
});
