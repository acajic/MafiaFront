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



            var daysUntilReveal = scope.actionTypeParams.days_until_reveal;
            if (!scope.reviveProps.daysUntilReveal || daysUntilReveal != scope.reviveProps.daysUntilReveal.toString()) {
                scope.reviveProps.daysUntilReveal = parseInt(daysUntilReveal);
            }

            scope.isInfinite = scope.actionTypeParams.number_of_actions_available < 0;





            var correctedDaysUntilReveal = function(daysUntilReveal) {
                if (daysUntilReveal < 0)
                    return 0;
                if (daysUntilReveal > 5)
                    return 5;

                return daysUntilReveal;
            };


            scope.daysUntilRevealDidChange = function () {
                scope.reviveProps.daysUntilReveal = correctedDaysUntilReveal(scope.reviveProps.daysUntilReveal);

                scope.actionTypeParams.days_until_reveal = scope.reviveProps.daysUntilReveal;

            };



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