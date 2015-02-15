app.directive('protectActionTypeParamsResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeParams: '=',
            editMode: '=',
            toggleMode: '&'
        },
        templateUrl: 'app/directiveTemplates/domain/actionResults/actionTypeParamsResults/protectActionTypeParamsResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.$watch('actionTypeParams', function(actionTypeParams) {
                if (actionTypeParams.number_of_actions_available === undefined)
                    return;

                scope.isInfinite = actionTypeParams.number_of_actions_available < 0;
            });

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