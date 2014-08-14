app.directive('citiesList', function(citiesService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/citiesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 10;


            scope.cities = [];
            scope.noMoreContent = false;
            if (!scope.queryModel) {
                scope.queryModel = {
                    timezoneDate: new Date(0, 0, 0, 0, 0, 0, 0),
                    timezoneSign: 1,
                    anyTimezone: true
                };
            }

            scope.$watch("queryModel.timezoneDate", function(newDate, oldDate) {
                if (newDate) {
                    if (newDate.getHours() > 12) {
                        scope.queryModel.timezoneDate = 12;
                    }
                }
            });

            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.cities = [];
                }

                var citiesPromise = citiesService.getAllCities(scope.queryModel, pageIndex, pageSize);


                citiesPromise.then(function(citiesResult) {
                    scope.isLoadingContent = false;
                    if (citiesResult.length < pageSize) {
                        scope.noMoreContent = true;
                    } else {
                        scope.noMoreContent = false;
                    }

                    pageIndex++;
                    scope.cities.push.apply(scope.cities, citiesResult);
                }, function(reason) {
                    scope.isLoadingContent = false;
                });
            };

            scope.reloadData = reloadData;

            reloadData();

        }
    };
});