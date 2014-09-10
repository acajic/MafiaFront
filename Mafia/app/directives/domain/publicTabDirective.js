app.directive('publicTab', function(rolesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            roleId: '=',
            resident: '=',
            actionResults: '=',
            actionResultsByType: '=',
            isLoadingActionResults: '=',
            dayNumberMin: '=',
            dayNumberMax: '=',
            hasEarlierActionResults: '=',
            loadEarlierActionResults: '=',
            hasMoreRecentActionResults: '=',
            loadMoreRecentActionResults: '='
        },
        templateUrl: 'app/directiveTemplates/domain/publicTab.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.roleIds = rolesService.roleIds;
        }
    };
});