app.directive('mob', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/mob.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_MOB;

        }
    };
});