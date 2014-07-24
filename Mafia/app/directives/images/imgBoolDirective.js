app.directive('imgBool', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            booleanValue: '='
        },
        templateUrl: 'app/directiveTemplates/images/imgBool.html'
    };
});