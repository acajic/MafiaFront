app.directive('fugitive', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/fugitive.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_FUGITIVE;
        }
    };
});