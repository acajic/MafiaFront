app.directive('role', function(rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            resident : '=',
            actionResults: '=',
            actionResultsByType: '=',
            isLoading: '='
        },
        templateUrl: 'app/directiveTemplates/domain/role.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleIds = rolesService.roleIds;

        }
    };
});