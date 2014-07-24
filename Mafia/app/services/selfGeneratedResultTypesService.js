app.factory('selfGeneratedResultTypesService', function(serverService, $q) {
    "use strict";

    var allSelfGeneratedResultTypes;

    var getAllSelfGeneratedResultTypes = function(refresh) {
        var deferred = $q.defer();

        if (!allSelfGeneratedResultTypes || refresh) {
            var selfGeneratedResultTypesPromise = serverService.get('self_generated_result_types', {});

            selfGeneratedResultTypesPromise.then(function(result) {
                allSelfGeneratedResultTypes = result;
            });
            return selfGeneratedResultTypesPromise;
        } else {
            deferred.resolve(allSelfGeneratedResultTypes);
        }

        return deferred.promise;
    };

    return {
        allSelfGeneratedResultTypes : allSelfGeneratedResultTypes,
        getAllSelfGeneratedResultTypes : getAllSelfGeneratedResultTypes
    };
});
