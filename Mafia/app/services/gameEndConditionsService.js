app.service('gameEndConditionsService', function(serverService, $q) {
    "use strict";

    var allGameEndConditions;

    this.getAllGameEndConditions = function(refresh) {
        var deferred = $q.defer();

        if (!allGameEndConditions || refresh) {
            var gameEndConditionsPromise = serverService.get('game_end_conditions',{});
            gameEndConditionsPromise.then(function(result) {
                allGameEndConditions = result;
            });

            return gameEndConditionsPromise;
        } else {
            deferred.resolve(allGameEndConditions);
        }

        return deferred.promise;
    };
});
