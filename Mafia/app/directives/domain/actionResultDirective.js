app.directive('actionResult', function(actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResult: '=',
            actionResults: '=',
            editMode: '=',
            isNew: '=',
            hide: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResult.html',
        compile: function (element, attrs) {
            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    "use strict";

                    scope.actionResultTypeIds = actionResultsService.actionResultTypeIds;
                }
            };
        }
    };
});