app.directive('doctor', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/doctor.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_DOCTOR;

        }
    };
});