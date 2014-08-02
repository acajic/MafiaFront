app.directive('terroristBombActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/terroristBombActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            var detonationNumber = parseInt(scope.actionTypeParams.detonation_delay.slice(0,-1));
            var detonationTimeInterval = scope.actionTypeParams.detonation_delay.slice(-1);

            scope.detonationProps = {
                detonationNumber : detonationNumber || 5,
                detonationTimeInterval : detonationTimeInterval || 'm'
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
                    scope.detonationProps.detonationTimeInterval = detonationTimeInterval;
                }

            }, true);

        }
    };
});