/**
 * Created by Andro on 11.1.2015..
 */

var scripts = document.getElementsByTagName("script");
var acRelativeDateScriptPath = scripts[scripts.length-1].src;

angular.module('ui.acRelativeDate', []).directive('acRelativeDate', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: acRelativeDateScriptPath.replace('acRelativeDate.js', 'acRelativeDate.html'),
        scope: {
            ngModel: '=',
            dateNow: '='
        },
        link: function(scope, element, attrs) {
            "use strict";

            scope.dateString = '';

            scope.$watch('ngModel', function (newValue) {
                if (typeof newValue.getTime !== 'function') {
                    newValue = new Date(newValue);
                }

                if (typeof scope.dateNow.getTime !== 'function') {
                    return;
                }

                var intervalNumber;
                var timeDiff = scope.dateNow.getTime() - newValue.getTime();
                if (timeDiff < 1*60*1000) {
                    scope.dateString = 'Just now';
                    return;
                }
                timeDiff /= 1*60*1000;
                if (timeDiff < 60) {
                    intervalNumber = parseInt(Math.floor(timeDiff));
                    scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' minute ago' : '' + intervalNumber + ' minutes ago';
                    return;
                }
                timeDiff /= 60;
                if (timeDiff < 24) {
                    intervalNumber = parseInt(Math.floor(timeDiff));
                    scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' hour ago' : '' + intervalNumber + ' hours ago';
                    return;
                }
                timeDiff /= 24;
                if (timeDiff < 7) {
                    intervalNumber = parseInt(Math.floor(timeDiff));
                    scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' day ago' : '' + intervalNumber + ' days ago';
                    return;
                }
                var weeks = timeDiff / 7;
                if (weeks < 4) {
                    intervalNumber = parseInt(Math.floor(weeks));
                    scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' week ago' : '' + intervalNumber + ' weeks ago';
                    return;
                }
                timeDiff /= 30;
                if (timeDiff < 12) {
                    intervalNumber = parseInt(Math.floor(timeDiff));
                    scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' month ago' : '' + intervalNumber + ' months ago';
                    return;
                }
                timeDiff /= 12;
                intervalNumber = parseInt(Math.floor(timeDiff));
                scope.dateString = intervalNumber == 1 ? '' + intervalNumber + ' year ago' : '' + intervalNumber + ' years ago';
            });

        }
    };
});