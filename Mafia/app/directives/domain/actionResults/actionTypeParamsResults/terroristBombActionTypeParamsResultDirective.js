app.directive('terroristBombActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/terroristBombActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.detonationProps = {
                detonationNumber : 5,
                detonationTimeInterval : 'm'
            };

            var isNumberOfCollateralsValid = function(numberOfCollaterals) {
                return numberOfCollaterals >= 0 && numberOfCollaterals <= 2;
            };

            scope.$watch('actionTypeParams.number_of_collaterals', function(newValue, oldValue) {
                if (!isNumberOfCollateralsValid(newValue)) {
                    if (isNumberOfCollateralsValid(oldValue))
                        scope.actionTypeParams.number_of_collaterals = oldValue;
                    else
                        scope.actionTypeParams.number_of_collaterals = 1;
                }

            }, true);



            var isTimeIntervalValid = function(timeIntervalString) {
                if (!timeIntervalString)
                    return false;

                var lastChar = timeIntervalString.slice(-1);
                return !isNaN(timeIntervalString.slice(0,-1)) && (lastChar == 'h' || lastChar == 'm' || lastChar == 's')
            };

            var isDetonationNumberValid = function(detonationNumber) {

                return detonationNumber > 0 && detonationNumber < 60;
            };

            scope.$watch('detonationProps.detonationNumber', function(newValue, oldValue) {
                if (newValue === undefined || !scope.actionTypeParams.detonation_delay)
                    return;

                if (!isDetonationNumberValid(newValue)) {
                    if (isDetonationNumberValid(oldValue)) {
                        scope.detonationProps.detonationNumber = oldValue;
                    } else {
                        scope.detonationProps.detonationNumber = 5;
                    }


                }
                var lastChar = scope.actionTypeParams.detonation_delay.slice(-1);
                scope.actionTypeParams.detonation_delay = '' + scope.detonationProps.detonationNumber + lastChar;

            });

            var isDetonationTimeIntervalValid = function(detonationTimeInterval) {
                return detonationTimeInterval == 'h' || detonationTimeInterval == 'm' || detonationTimeInterval == 's';
            };

            scope.$watch('detonationProps.detonationTimeInterval', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;


                if (!isDetonationTimeIntervalValid(newValue)) {
                    if (isDetonationTimeIntervalValid(oldValue)) {
                        scope.detonationProps.detonationTimeInterval = oldValue;
                    } else {
                        scope.detonationProps.detonationTimeInterval = '5m';
                    }


                }
                var detonationNumber = scope.detonationProps.detonationNumber;
                scope.actionTypeParams.detonation_delay = '' + detonationNumber + scope.detonationProps.detonationTimeInterval;

            }, true);

            scope.$watch('actionTypeParams.detonation_delay', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;

                var detonationNumber = newValue.slice(0,-1);
                if (!scope.detonationProps.detonationNumber || detonationNumber != scope.detonationProps.detonationNumber.toString()) {
                    // scope.detonationProps.detonationNumber = parseInt(detonationNumber);
                }
                var detonationTimeInterval = newValue.slice(-1);
                if (detonationTimeInterval != scope.detonationProps.detonationTimeInterval) {
                    // scope.detonationProps.detonationTimeInterval = detonationTimeInterval;
                }

            }, true);

            /*
            scope.$watch('[actionResult, roleId]', function(values) {
                var actionResult = values[0];
                if (!actionResult)
                    return;
                var result = actionResult.result;

                var roleId = values[1];
                if (!roleId)
                    return;

                scope.actionTypeParams = actionResult.result.action_types_params[roleId.toString()][ACTION_TYPE_ID_TERRORIST_BOMB.toString()];

            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    scope.actionResults.splice(index, 1);
                });
            };

            scope.submitActionResult = function() {
                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResult.action_result_type,
                    scope.actionResult.action_id,
                    scope.actionResult.day_id,
                    {
                        detonation_delay : actionTypeParams.detonation_delay.toString() + "s",
                        number_of_collaterals : actionTypeParams.number_of_collaterals
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    scope.actionResults.splice(index, 1, createdActionResult);

                    scope.editMode = false;
                });
            };
*/

        }
    };
});