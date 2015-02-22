app.directive('actionTypeParamsResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident: '=',
            actionResult: '=',
            actionResults: '=',
            actionTypeId: '=',
            roleId: '=',
            isNew: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeParams = {};
            scope.editMode = false;

            function init() {
                if (!scope.actionResult || !scope.actionResult.result)
                    return;

                var actionTypeParamsPerRolePerActionType = scope.actionResult.result.action_types_params;

                if (!actionTypeParamsPerRolePerActionType[scope.roleId.toString()])
                    return;

                var actionTypeParams = actionTypeParamsPerRolePerActionType[scope.roleId.toString()][scope.actionTypeId.toString()];


                scope.actionTypeParams = actionTypeParams;

            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var modifiedActionResult = {};
                angular.copy(scope.actionResult, modifiedActionResult);

                modifiedActionResult.result.action_types_params[scope.roleId.toString()][scope.actionTypeId.toString()] = null;

                postActionResult(modifiedActionResult);
            };


            function postActionResult(actionResult) {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null, // role id
                    actionResult.action_result_type,
                    null, // action id
                    actionResult.day_id,
                    actionResult.result
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });


                    scope.actionResult = createdActionResult;
                    init();

                    $timeout(function() {
                        scope.actionResults.splice(index, 1, createdActionResult);
                        scope.editMode = false;
                    });

                }, function(reason) {
                    $timeout(function() {
                        scope.infos = [{type:'danger', msg:'Failed to save.'}];
                        scope.editMode = false;
                    });
                });
            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.submitActionResult = function() {
                postActionResult(scope.actionResult);
            };

        }
    };
});