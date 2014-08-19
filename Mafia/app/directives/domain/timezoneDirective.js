app.directive('timezone', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            minutes: '='
        },
        template: '{{timezone}}',
        link: function(scope, element, attrs) {
            "use strict";
            scope.$watch('minutes', function(value) {
                var minutes = scope.minutes;
                var sign = minutes?minutes<0?-1:1:0;

                var hours = Math.floor(Math.abs(minutes) / 60);
                var sign = sign >= 0 ? '' : '-';
                hours = '0' + hours;
                var minutes = (Math.abs(minutes)) % 60;
                minutes = '0' + minutes;

                scope.timezone = sign + hours.substr(hours.length-2) + ":" + minutes.substr(minutes.length-2);
            });

        }
    };
});