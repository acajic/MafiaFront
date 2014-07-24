app.directive('citizen', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/citizen.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_CITIZEN;

        }
    };
});