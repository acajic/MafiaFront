/**
 * Created by Andro on 11.1.2015..
 */
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;

angular.module('ui.acTimezonePicker', []).directive('acTimezonePicker', function($timeout) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: currentScriptPath.replace('acTimezonePicker.js', 'acTimezonePicker.html'),
        scope: {
            ngModel: '=',
            useBootstrap: '@'
        },
        link: function(scope, element, attrs) {
            "use strict";

            var hourPaddedString = '0' + Math.floor(Math.abs(scope.ngModel)/60).toString();
            scope.hour = hourPaddedString.substr(hourPaddedString.length-2);
            var minutePaddedString = '0' + (Math.abs(scope.ngModel)%60).toString();
            scope.minute = minutePaddedString.substr(minutePaddedString.length-2);

            scope.$watch("ngModel", function (newValue, oldValue) {
                var hourPaddedString = '0' + Math.floor(Math.abs(newValue)/60).toString();
                scope.hour = hourPaddedString.substr(hourPaddedString.length-2);
                var minutePaddedString = '0' + (Math.abs(newValue)%60).toString();
                scope.minute = minutePaddedString.substr(minutePaddedString.length-2);
            });

            scope.hourPlus = function () {
                if (scope.ngModel <= 60*11)
                    scope.ngModel += 60;
            };

            scope.hourMinus = function () {
                if (scope.ngModel >= -60*11)
                    scope.ngModel -= 60;
            };

            scope.minutePlus = function () {
                if (scope.ngModel <= 60*12-15)
                    scope.ngModel += 15;
            };

            scope.minuteMinus = function () {
                if (scope.ngModel >= -12*60 + 15)
                    scope.ngModel -= 15;
            };
        }
    };
});