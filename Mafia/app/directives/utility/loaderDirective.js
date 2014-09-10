app.directive('loader', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/utility/loader.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.size = attrs.size;

            if (attrs.center !== undefined) {
                scope.style = "display: block; margin: 0 auto;";
            }
        }
    };
});