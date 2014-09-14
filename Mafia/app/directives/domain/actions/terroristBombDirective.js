app.directive('terroristBomb', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/terroristBomb.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.selectedResident = {};

            scope.$watch('actionTypeParamsResult', function(actionTypeParamsResult) {
                if (!actionTypeParamsResult)
                    return;

                scope.actionTypeParamsDictionary = actionTypeParamsResult.result.action_types_params[scope.roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];

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
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                    });
                }, function(reason) {
                    angular.forEach(reason.httpObj.responseJSON, function(error) {
                        scope.infos.push({type : 'danger', msg: error })
                    });
                });
            };

        }
    };
});