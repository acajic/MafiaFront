app.controller('CityDiscussionController', function ($scope, $routeParams, $location) {
    "use strict";

    var backToCity = function () {
        $location.path('/cities/' + $scope.cityId);
    };

    init();

    function init() {
        var cityId = parseInt($routeParams["cityId"]);
        $scope.cityId = cityId;

        $scope.url = $location.absUrl();

        $scope.backToCity = backToCity;
    }

});