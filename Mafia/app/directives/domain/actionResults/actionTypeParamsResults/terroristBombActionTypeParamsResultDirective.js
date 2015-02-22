app.directive('terroristBombActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/terroristBombActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            var detonationNumber;
            var detonationTimeInterval;
            if (scope.actionTypeParams && scope.actionTypeParams.detonation_delay && scope.actionTypeParams.number_of_collaterals !== undefined) {
                detonationNumber = parseInt(scope.actionTypeParams.detonation_delay.slice(0,-1));
                detonationTimeInterval = scope.actionTypeParams.detonation_delay.slice(-1);
            }


            scope.detonationProps = {
                detonationNumber : detonationNumber || 5,
                detonationTimeInterval : detonationTimeInterval || 'm'
            };


            var detonationNumber = scope.actionTypeParams.detonation_delay.slice(0,-1);
            if (!scope.detonationProps.detonationNumber || detonationNumber != scope.detonationProps.detonationNumber.toString()) {
                scope.detonationProps.detonationNumber = parseInt(detonationNumber);
            }
            var detonationTimeInterval = scope.actionTypeParams.detonation_delay.slice(-1);
            if (detonationTimeInterval != scope.detonationProps.detonationTimeInterval) {
                scope.detonationProps.detonationTimeInterval = detonationTimeInterval;
            }


            var correctedNumberOfCollaterals = function(numberOfCollaterals) {
                if (numberOfCollaterals < 0)
                    return 0;
                if (numberOfCollaterals > 2)
                    return 2;
                return numberOfCollaterals;
            };

            scope.numberOfCollateralsDidChange = function() {
                scope.actionTypeParams.number_of_collaterals = correctedNumberOfCollaterals(scope.actionTypeParams.number_of_collaterals);


            };


            var correctedDetonationNumber = function(detonationNumber) {
                if (detonationNumber < 1)
                    return 1;
                if (detonationNumber > 59)
                    return 59;
                return detonationNumber;
            };


            scope.detonationNumberDidChange = function () {
                scope.detonationProps.detonationNumber = correctedDetonationNumber(scope.detonationProps.detonationNumber);

                var lastChar = scope.actionTypeParams.detonation_delay.slice(-1);
                scope.actionTypeParams.detonation_delay = '' + scope.detonationProps.detonationNumber + lastChar;
            };


            var isDetonationTimeIntervalValid = function(detonationTimeInterval) {
                return detonationTimeInterval == 'h' || detonationTimeInterval == 'm' || detonationTimeInterval == 's';
            };

            scope.detonationTimeIntervalDidChange = function () {
                if (!isDetonationTimeIntervalValid(newValue)) {
                    scope.detonationProps.detonationTimeInterval = 'm';
                }
                var detonationNumber = scope.detonationProps.detonationNumber;
                if (scope.actionTypeParams)
                    scope.actionTypeParams.detonation_delay = '' + detonationNumber + scope.detonationProps.detonationTimeInterval;
            };




        }
    };
});