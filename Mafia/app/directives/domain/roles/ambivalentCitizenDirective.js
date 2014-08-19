app.directive('ambivalentCitizen', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/ambivalentCitizen.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_AMBIVALENT_CITIZEN;

        }
    };
});