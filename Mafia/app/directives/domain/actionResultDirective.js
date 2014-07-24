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
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionResultTypeIds = actionResultsService.actionResultTypeIds;
        }
    };
});