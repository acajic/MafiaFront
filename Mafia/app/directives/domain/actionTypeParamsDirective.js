app.directive('actionTypeParams', function(actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            actionTypeId: '=',
            actionTypeParams: '=',
            editMode: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionTypeParams.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.actionTypeIds = actionsService.actionTypeIds;

        }
    };
});