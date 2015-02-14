app.directive('reviveActionTypeParamsResult', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/reviveActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            var daysUntilReveal;
            if (scope.actionTypeParams && scope.actionTypeParams.days_until_reveal) {
                daysUntilReveal = parseInt(scope.actionTypeParams.days_until_reveal);
            }


            scope.reviveProps = {
                daysUntilReveal : daysUntilReveal || 1
            };


            var isDaysUntilRevealValid = function(daysUntilReveal) {

                return daysUntilReveal >= 0 && daysUntilReveal <= 5;
            };

            scope.$watch('reviveProps.daysUntilReveal', function(newValue, oldValue) {
                if (newValue === undefined || !scope.actionTypeParams || scope.actionTypeParams.days_until_reveal === undefined)
                    return;

                if (!isDaysUntilRevealValid(newValue)) {
                    if (isDaysUntilRevealValid(oldValue)) {
                        scope.reviveProps.daysUntilReveal = oldValue;
                    } else {
                        scope.reviveProps.daysUntilReveal = 1;
                    }


                }
                scope.actionTypeParams.days_until_reveal = scope.reviveProps.daysUntilReveal;

            });

            scope.$watch('actionTypeParams.days_until_reveal', function(newValue, oldValue) {
                if (newValue === undefined)
                    return;

                var daysUntilReveal = newValue;
                if (!scope.reviveProps.daysUntilReveal || daysUntilReveal != scope.reviveProps.daysUntilReveal.toString()) {
                    scope.reviveProps.daysUntilReveal = parseInt(daysUntilReveal);
                }

            }, true);

        }
    };
});