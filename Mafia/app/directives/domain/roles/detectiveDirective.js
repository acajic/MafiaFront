app.directive('detective', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/roles/detective.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleId = ROLE_ID_DETECTIVE;

        }
    };
});