app.controller('CityDiscussionController', function ($scope, $routeParams, $location, citiesService) {
    "use strict";

    var backToCity = function () {
        $location.path('/cities/' + $scope.cityId);
    };

    init();

    function init() {
        var cityId = parseInt($routeParams["cityId"]);

        $scope.cityId = cityId;

        var cityPromise = citiesService.getCity(cityId);

        cityPromise.then(function(city) {
            $scope.city = city;
        }, function(reason) {
            console.log('Failed to retrieve city for city id: ' + cityId);
        });

        $scope.url = $location.absUrl();

        $scope.backToCity = backToCity;
    }

});