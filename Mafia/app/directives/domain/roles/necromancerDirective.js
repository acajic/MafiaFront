app.directive('necromancer', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/necromancer.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_NECROMANCER;

        }
    };
});