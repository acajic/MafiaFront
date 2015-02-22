app.directive('initiateRevivalActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
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


            var correctedRevivalDelayNumber = function(revivalDelayNumber) {
                if (revivalDelayNumber < 1)
                    return 1;
                if (revivalDelayNumber > 59)
                    return 59;
                return revivalDelayNumber;
            };

            scope.revivalDelayNumberDidChange = function () {
                scope.initiateRevivalProps.revivalDelayNumber = correctedRevivalDelayNumber(scope.initiateRevivalProps.revivalDelayNumber);

                var lastChar = scope.actionTypeParams.revival_delay.slice(-1);
                scope.actionTypeParams.revival_delay = '' + scope.initiateRevivalProps.revivalDelayNumber + lastChar;
            };

            var isInitiateRevivalTimeIntervalValid = function(revivalDelayTimeInterval) {
                return revivalDelayTimeInterval == 'h' || revivalDelayTimeInterval == 'm' || revivalDelayTimeInterval == 's';
            };

            scope.revivalDelayTimeIntervalDidChange = function () {
                if (!isInitiateRevivalTimeIntervalValid(scope.initiateRevivalProps.revivalDelayTimeInterval)) {
                    scope.initiateRevivalProps.revivalDelayTimeInterval = 'm';
                }
                var revivalDelayNumber = scope.initiateRevivalProps.revivalDelayNumber;
                if (scope.actionTypeParams)
                    scope.actionTypeParams.revival_delay = '' + revivalDelayNumber + scope.initiateRevivalProps.revivalDelayTimeInterval;

            };

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