app.directive('terroristBomb', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/terroristBomb.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.selectedResident = {};

            scope.$watch('actionResults', function(actionResults) {
                if (!actionResults)
                    return;

                // var actionResults = values[0];
                var actionTypeParamsResultIndex = actionResults.indexOfMatchFunction(function (someActionResult) {
                    return someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS;
                });
                if (actionTypeParamsResultIndex < 0) {
                    return;
                }

                var roleId = scope.roleId;
                if (!roleId)
                    return;

                // var actionTypeParamsResult = actionResults[actionTypeParamsResultIndex].result.action_types_params;
                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];

                scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];

            }, true);

            scope.infos = [];

            scope.bombOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_TERRORIST_BOMB,
                    scope.city.current_day_id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Bombing " + selectedResident.name + " in " + scope.actionTypeParamsDictionary.detonation_delay + "."}];
                    });

                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_TERRORIST_BOMB);
                cancelUnprocessedActionsPromise.then(function() {
                    scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
});