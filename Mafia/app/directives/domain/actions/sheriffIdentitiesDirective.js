app.directive('sheriffIdentities', function($timeout, actionsService, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/sheriffIdentities.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

            actionResultsService.getAllActionResultTypesByIds(false).then(function(actionResultTypesByIdsResult) {
                scope.actionResultTypes = actionResultTypesByIdsResult;
            });

            scope.actionTypeParamsResult = {};

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

                // var actionTypeParamsResult = actionResults[actionTypeParamsResultIndex].result.action_types_params;
                scope.actionTypeParamsResult = actionResults[actionTypeParamsResultIndex];

                scope.actionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_SHERIFF_IDENTITIES.toString()];


            }, true);


            scope.revealIdentities = function() {

                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_SHERIFF_IDENTITIES,
                    scope.city.current_day_id,
                    { });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "On the next morning, the true identities of all deceased residents will be revealed."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_SHERIFF_IDENTITIES);

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