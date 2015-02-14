app.directive('initiateRevivalActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/initiateRevivalActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            var revivalDelayNumber;
            var revivalDelayTimeInterval;
            if (scope.actionTypeParams && scope.actionTypeParams.revival_delay) {
                revivalDelayNumber = parseInt(scope.actionTypeParams.revival_delay.slice(0,-1));
                revivalDelayTimeInterval = scope.actionTypeParams.revival_delay.slice(-1);
            }


            scope.initiateRevivalProps = {
                revivalDelayNumber : revivalDelayNumber || 5,
                revivalDelayTimeInterval : revivalDelayTimeInterval || 'm'
            };


            var isRevivalDelayNumberValid = function(revivalDelayNumber) {

                return revivalDelayNumber > 0 && revivalDelayNumber < 60;
            };

            scope.$watch('initiateRevivalProps.revivalDelayNumber', function(newValue, oldValue) {
                if (newValue === undefined || !scope.actionTypeParams || !scope.actionTypeParams.revival_delay)
                    return;

                if (!isRevivalDelayNumberValid(newValue)) {
                    if (isRevivalDelayNumberValid(oldValue)) {
                        scope.initiateRevivalProps.revivalDelayNumber = oldValue;
                    } else {
                        scope.initiateRevivalProps.revivalDelayNumber = 5;
                    }


                }
                var lastChar = scope.actionTypeParams.revival_delay.slice(-1);
                scope.actionTypeParams.revival_delay = '' + scope.initiateRevivalProps.revivalDelayNumber + lastChar;

            });

            var isInitiateRevivalTimeIntervalValid = function(revivalDelayTimeInterval) {
                return revivalDelayTimeInterval == 'h' || revivalDelayTimeInterval == 'm' || revivalDelayTimeInterval == 's';
            };

            scope.$watch('initiateRevivalProps.revivalDelayTimeInterval', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;


                if (!isInitiateRevivalTimeIntervalValid(newValue)) {
                    if (isInitiateRevivalTimeIntervalValid(oldValue)) {
                        scope.initiateRevivalProps.revivalDelayTimeInterval = oldValue;
                    } else {
                        scope.initiateRevivalProps.revivalDelayTimeInterval = 'm';
                    }


                }
                var revivalDelayNumber = scope.initiateRevivalProps.revivalDelayNumber;
                if (scope.actionTypeParams)
                    scope.actionTypeParams.revival_delay = '' + revivalDelayNumber + scope.initiateRevivalProps.revivalDelayTimeInterval;

            }, true);

            scope.$watch('actionTypeParams.revival_delay', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;

                var revivalDelayNumber = newValue.slice(0,-1);
                if (!scope.initiateRevivalProps.revivalDelayNumber || revivalDelayNumber != scope.initiateRevivalProps.revivalDelayNumber.toString()) {
                    scope.initiateRevivalProps.revivalDelayNumber = parseInt(revivalDelayNumber);
                }
                var revivalDelayTimeInterval = newValue.slice(-1);
                if (revivalDelayTimeInterval != scope.initiateRevivalProps.revivalDelayTimeInterval) {
                    scope.initiateRevivalProps.revivalDelayTimeInterval = revivalDelayTimeInterval;
                }

            }, true);

        }
    };
});