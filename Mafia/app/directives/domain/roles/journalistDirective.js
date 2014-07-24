app.directive('journalist', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/journalist.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_JOURNALIST;

        }
    };
});