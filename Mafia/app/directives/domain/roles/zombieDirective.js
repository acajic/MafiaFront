app.directive('zombie', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/zombie.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_ZOMBIE;

        }
    };
});