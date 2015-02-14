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

            function timezoneFromMinutes(minutes) {
                var sign = minutes < 0 ? -1 : 1;

                var hours = Math.floor(Math.abs(minutes) / 60);
                var sign = sign >= 0 ? '' : '-';
                hours = '0' + hours;
                var minutes = (Math.abs(minutes)) % 60;
                minutes = '0' + minutes;

                var timezoneString = sign + hours.substr(hours.length-2) + ":" + minutes.substr(minutes.length-2);
                return timezoneString;
            }

            scope.timezone = timezoneFromMinutes(scope.minutes);

            scope.$watch('minutes', function(value) {
                if (value === undefined)
                    return;

                scope.timezone = timezoneFromMinutes(value);
            });



        }
    };
});