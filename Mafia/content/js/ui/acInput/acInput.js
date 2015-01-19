// var scripts = document.getElementsByTagName("script");
// var currentScriptPath = scripts[scripts.length-1].src;

angular.module('ui.acInput', []).directive('acInput', function($timeout) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'content/js/ui/acInput/acInput.html',//currentScriptPath.replace('acInput.js', 'acInput.html'),
        scope: {
            ngModel: '=',
            delay: '=',
            onDelayAction: '='
        },
        link: function(scope, element, attrs) {
            "use strict";

            scope.type = attrs['type'];
            scope.placeholder = attrs['placeholder'];

            var timeOfLastChange = (new Date()).getTime();

            scope.inputDidChange = function() {
                timeOfLastChange = (new Date()).getTime();
                $timeout(function() {


                    var timeNow = (new Date()).getTime();
                    var timeSinceLastChange = timeNow - timeOfLastChange;
                    if (timeSinceLastChange < scope.delay - 3) {
                        return;
                    }

                    scope.onDelayAction();
                }, scope.delay);
            };



        }
    };
});