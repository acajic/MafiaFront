app.directive('info', function($routeParams, $location, $route, rolesService, navigationService) {
    return {
        restrict: 'E',
        scope: {
            change: '&'
        },
        link: function(scope, element, attrs) {
            "use strict";

            var tabClasses;

            function initTabs() {
                tabClasses = ["","","",""];
            }

            scope.getTabClass = function (tabNum) {
                return tabClasses[tabNum];
            };

            scope.getTabPaneClass = function (tabNum) {
                return "tab-pane " + tabClasses[tabNum];
            };

            scope.setActiveTab = function (tabNum) {
                scope.index = tabNum;
                navigationService.home.selectedInfoIndex = tabNum;

                initTabs();
                tabClasses[tabNum] = "active";

                if (scope.change) {
                    scope.change();
                }
            };

            //Initialize

            initTabs();

            var routePath = $route.current.$$route ? $route.current.$$route.originalPath : '';

            var index = 0;
            for (var i = 0; i < navigationService.home.infoPaths.length; i++) {
                if (routePath == '/' + navigationService.home.infoPaths[i]) {
                    index = i;
                    break;
                }
            }
            scope.index = index;
            scope.setActiveTab(index);

            rolesService.getAllRoles().then(function(allRolesResult) {
                scope.allRoles = allRolesResult;
            });
            scope.affiliationIds = rolesService.affiliationIds;
        },
        templateUrl: 'app/directiveTemplates/info.html'
    };
});