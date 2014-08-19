app.directive('currentDay', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/currentDay.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.editMode = false;

            scope.$watch('city', function(city) {
                if (!city)
                    return;


            }, true);

            scope.toggleMode = function() {
                if (scope.city.finished_at)
                    return;

                scope.editMode = !scope.editMode;
            };

        }
    };
});