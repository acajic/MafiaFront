app.directive('elder', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/elder.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_ELDER_CITIZEN;

        }
    };
});