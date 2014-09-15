app.directive('residents', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            actionResults : '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/residents.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.$watch('actionResultsByType', function(actionResultsByType) {

                if (!actionResultsByType)
                    return;

                var residentsActionResults = actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS];
                if (!residentsActionResults)
                    return;

                var residentsActionResult = residentsActionResults[0];
                if (!residentsActionResult)
                    return;

                if (!scope.actionResult || residentsActionResult.day_id > scope.actionResult.day_id) {
                    scope.actionResult = residentsActionResult;

                    var result = residentsActionResult.result;
                    var residents = $.map(result.residents, function (someResident) {
                        scope.city.residentsById[someResident.id].alive = someResident.alive;
                        return angular.copy(scope.city.residentsById[someResident.id]);
                    });

                    scope.residentsCopied = residents;
                }
            }, true);
/*

            scope.$watch('city.residentsById', function(residentsById) {
                if (!residentsById)
                    return;

                var residents = [];
                for (var residentId in residentsById) {
                    if (residentsById.hasOwnProperty(residentId)) {
                        var resident = residentsById[residentId];
                        residents.push(angular.copy(resident));
                    }
                }
                scope.residentsCopied = residents;
            }, true);
*/


            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.submitActionResult = function() {
                var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                    return someActionResult.id == scope.actionResult.id;
                });

                if (index < 0)
                    return;

                var actionResult = scope.actionResult;

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    actionResult.day_id,
                    {
                        residents : $.map(scope.residentsCopied, function(someResident) {
                            return {
                            id : someResident.id,
                            alive : someResident.alive
                        }})
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {

                    $timeout(function() {
                        scope.actionResults.splice(index, 1, createdActionResult);
                        scope.editMode = false;
                    });

                }, function(reason) {
                    $timeout(function() {
                        scope.infos.push({type: 'danger', msg:'Failed to save.'})
                    });
                });
            };



            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

        }
    };
});