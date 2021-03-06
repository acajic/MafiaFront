app.factory('daysService', function($q, serverService) {
    "use strict";



    var getAllDays = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var daysPromise = serverService.get('days', {
            page_index: pageIndex,
            page_size: pageSize,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            number_min: queryModel.numberMin,
            number_max: queryModel.numberMax,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });


        return daysPromise.then(function(daysResult) {
            return daysResult;
        }, function(reason) {
            return reason;
        });

    };

    return {
        getAllDays : getAllDays
    };
});