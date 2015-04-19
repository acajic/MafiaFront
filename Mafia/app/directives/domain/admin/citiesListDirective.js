app.directive('citiesList', function($location, citiesService, authService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            queryModel: '=',
            queryable: '=',
            visible: '='
        },
        templateUrl: 'app/directiveTemplates/domain/admin/citiesList.html',
        link: function(scope, element, attrs) {
            "use strict";

            var pageIndex = 0;
            var pageSize = 20;


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

            scope.showDetails = function(city) {
                $location.path('admin/city/'+city.id);
            };



            var reloadData = function(refresh) {
                scope.isLoadingContent = true;

                if (refresh) {
                    pageIndex = 0;
                    scope.cities = [];

                    if (scope.queryable) {
                        var queryModelForStorage = angular.copy(scope.queryModel);
                        queryModelForStorage['timezoneDate'] = queryModelForStorage['timezoneDate'] ? queryModelForStorage['timezoneDate'].getTime() : null;
                        queryModelForStorage['createdAtMin'] = queryModelForStorage['createdAtMin'] ? queryModelForStorage['createdAtMin'].getTime() : null;
                        queryModelForStorage['createdAtMax'] = queryModelForStorage['createdAtMax'] ? queryModelForStorage['createdAtMax'].getTime() : null;
                        queryModelForStorage['updatedAtMin'] = queryModelForStorage['updatedAtMin'] ? queryModelForStorage['updatedAtMin'].getTime() : null;
                        queryModelForStorage['updatedAtMax'] = queryModelForStorage['updatedAtMax'] ? queryModelForStorage['updatedAtMax'].getTime() : null;
                        queryModelForStorage['startedAtMin'] = queryModelForStorage['startedAtMin'] ? queryModelForStorage['startedAtMin'].getTime() : null;
                        queryModelForStorage['startedAtMax'] = queryModelForStorage['startedAtMax'] ? queryModelForStorage['startedAtMax'].getTime() : null;
                        queryModelForStorage['lastPausedAtMin'] = queryModelForStorage['lastPausedAtMin'] ? queryModelForStorage['lastPausedAtMin'].getTime() : null;
                        queryModelForStorage['lastPausedAtMax'] = queryModelForStorage['lastPausedAtMax'] ? queryModelForStorage['lastPausedAtMax'].getTime() : null;
                        queryModelForStorage['finishedAtMin'] = queryModelForStorage['finishedAtMin'] ? queryModelForStorage['finishedAtMin'].getTime() : null;
                        queryModelForStorage['finishedAtMax'] = queryModelForStorage['finishedAtMax'] ? queryModelForStorage['finishedAtMax'].getTime() : null;
                        var queryModelJson = JSON.stringify(queryModelForStorage);
                        if (queryModelJson.length < 4000) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 7);
                            setCookie(kAdminQueryModelCities, queryModelJson, expirationDate);
                        }

                    }
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

            scope.$watch('visible', function (visible) {
                if (visible && scope.cities.length == 0) {
                    reloadData();
                }
            });

//            init();
//
//            function init() {
//                authService.userMe(false).then(function(userMeResult) {
//                    scope.userMe = userMeResult;
//                });
//            }


        }
    };
});