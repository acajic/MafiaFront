app.directive('forger', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/forger.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_FORGER;

        }
    };
});