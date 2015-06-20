app.directive('info', function($routeParams, $location, $route) {
    return {
        restrict: 'E',
        scope: {
            index: '=',
            change: '&'
        },
        link: function(scope, element, attrs) {
            "use strict";

            var tabClasses;

            var pageNames = ['welcome', 'about', 'roles', 'advanced'];


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

                initTabs();
                tabClasses[tabNum] = "active";

                if (scope.change) {
                    scope.change({pageName : pageNames[tabNum]});
                }
            };

            //Initialize

            initTabs();

            var routePath = $route.current.$$route ? $route.current.$$route.originalPath : '';

            var index = 0;
            for (var i = 0; i < pageNames.length; i++) {
                if (routePath == '/' + pageNames[i]) {
                    index = i;
                    break;
                }
            }
            scope.index = index;
            scope.setActiveTab(index);
        },
        templateUrl: 'app/directiveTemplates/info.html'
    };
});