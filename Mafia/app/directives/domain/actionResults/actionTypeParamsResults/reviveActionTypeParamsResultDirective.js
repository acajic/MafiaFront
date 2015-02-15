app.directive('reviveActionTypeParamsResult', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
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

            scope.$watch('actionTypeParams', function(newValue, oldValue) {
                if (newValue.days_until_reveal === undefined || newValue.number_of_actions_available === undefined)
                    return;

                var daysUntilReveal = newValue.days_until_reveal;
                if (!scope.reviveProps.daysUntilReveal || daysUntilReveal != scope.reviveProps.daysUntilReveal.toString()) {
                    scope.reviveProps.daysUntilReveal = parseInt(daysUntilReveal);
                }


                scope.isInfinite = newValue.number_of_actions_available < 0;

            }, true);

            scope.validateInput = function() {
                if (scope.actionTypeParams.number_of_actions_available < 0) {
                    scope.actionTypeParams.number_of_actions_available = 0;
                }
            };

            scope.isInfiniteChanged = function(){
                scope.isInfinite = !scope.isInfinite;
                if (scope.isInfinite) {
                    scope.actionTypeParams.number_of_actions_available = -1;
                } else {
                    scope.actionTypeParams.number_of_actions_available = 1;
                }
            };

        }
    };
});