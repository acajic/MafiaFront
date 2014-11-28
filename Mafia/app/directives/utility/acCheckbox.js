app.directive('acCheckbox', function() {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/utility/acCheckbox.html',
        scope: {
            ngModel: '='
        },
        transclude: true,
        link: function(scope, element, attrs) {
            "use strict";

            scope.acCheckboxId = attrs.id;

            var checked = element.find('.checked');
            checked.hide();
            var unchecked = element.find('.unchecked');
            unchecked.hide();

            scope.$watch('ngModel', function(newNgModel, oldNgModel) {
                var checked = element.find('.checked');
                var unchecked = element.find('.unchecked');

                if (newNgModel === true) {
                    checked.show();
                    unchecked.hide();
                } else {
                    checked.hide();
                    unchecked.show();
                }
            });
        }
    };
});