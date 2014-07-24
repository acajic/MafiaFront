app.directive('terrorist', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/terrorist.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_TERRORIST;

        }
    };
});