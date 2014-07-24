app.directive('imgAlive', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            booleanValue: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgAlive.html'
    };
});