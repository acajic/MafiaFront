app.directive('interactiveTable', function() {
    "use strict";
    return {
        restrict : 'A',
        scope: {
            selectedRowId: '='
        },
        link: function(scope, element, attrs) {
            $(element).on("click", "tbody tr", function() {
                var rowId = $(this).find("[name='id']").val();
                scope.$apply(function() {
                    scope.selectedRowId = rowId;
                });
            });


            scope.$watch("selectedRowId", function(newValue) {
                $(element).find("tr").removeClass("selected");
                var row = $(element).find("[name='id'][value='" + newValue + "']").parent();
                row.addClass("selected");
            });

        }
    };
})