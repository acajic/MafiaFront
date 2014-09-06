app.directive('roleDescription', function(rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            roleId: '='
        },
        templateUrl: 'app/directiveTemplates/domain/roles/roleDescription.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleIds = rolesService.roleIds;

        }
    };
});