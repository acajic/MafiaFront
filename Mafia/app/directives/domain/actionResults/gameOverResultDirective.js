app.directive('gameOverResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/gameOverResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.$watch('[actionResultsByType, city.residentsById]', function(values) {
                var actionResultsByType = values[0];
                if (!actionResultsByType)
                    return;

                var gameOverResults = actionResultsByType[ACTION_RESULT_TYPE_ID_GAME_OVER];
                if (!gameOverResults)
                    return;
                var gameOverResult = gameOverResults[0];
                if (!gameOverResult)
                    return;

                var result = gameOverResult.result;

                if (!result)
                    return;


                scope.winnerAffiliations = result['winner_affiliations'];
                scope.losersAffiliations = result['loser_affiliations'];
                var residents = result['residents_with_roles'];

                var residentsById = values[1];
                if (!residentsById)
                    residentsById = {};

                angular.forEach(residents, function(someResident) {
                    var affiliationId = someResident.role.affiliation.id;
                    var winningAffiliation = $.grep(scope.winnerAffiliations, function(someAffiliation) {
                        return someAffiliation.id == affiliationId;
                    })[0];

                    someResident.alive = residentsById[someResident.id] ? residentsById[someResident.id].alive : null;
                    if (winningAffiliation) {
                        someResident.won = true;
                    } else {
                        someResident.won = false;
                    }
                });

                scope.residentsWithRoles = residents;

            }, true);


            scope.classNameForResidentRow = function(resident) {
                if (resident.won)
                    return "resident-row-won";
                else
                    return "resident-row-lost";
            };

        }
    };
});