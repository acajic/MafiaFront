app.directive('imgCityStatus', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgCityStatus.html',
        link: function(scope, element, attrs) {

            var city = scope.city;

            scope.created = !city.started_at;
            scope.started = city.started_at && !city.paused && !city.finished_at;
            scope.paused = city.started_at && city.paused && !city.finished_at;
            scope.finished = city.finished_at;


        }
    };
});