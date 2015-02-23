app.directive('initiateRevival', function($timeout, $q, actionsService,actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/initiateRevival.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.selectedResident = {};

            scope.initiateRevivalActionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INITIATE_REVIVAL.toString()];
            scope.reviveActionTypeParamsDictionary = scope.actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_REVIVE.toString()];

            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.initiateRevivalActionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_INITIATE_REVIVAL.toString()];
                scope.reviveActionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_REVIVE.toString()];
            }, true);

            scope.infos = [];

            scope.initiateRevivalOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.roleId,
                    ACTION_TYPE_ID_INITIATE_REVIVAL,
                    scope.city.current_day.id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Initiating revival of " + selectedResident.name + ". After " + scope.initiateRevivalActionTypeParamsDictionary.revival_delay + " revival will be initiated and the user will be revived on the first following morning."}];
                    }, 0, false);

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
                var cancelUnprocessedInitiateRevivalActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_INITIATE_REVIVAL);
                var cancelUnprocessedReviveActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.roleId, ACTION_TYPE_ID_REVIVE);

                $q.all(cancelUnprocessedInitiateRevivalActionsPromise, cancelUnprocessedReviveActionsPromise).then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                        $timeout(function () {
                            scope.infos = [];
                        }, 2000);
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos = [{type : 'danger', msg: error }];
                    });
                });
            };

        }
    };
});