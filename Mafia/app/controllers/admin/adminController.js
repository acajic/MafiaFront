app.controller('AdminController',function ($scope, $q, usersService, citiesService, residentsService, actionsService, rolesService, authService, modalService, $location, layoutService) {
    "use strict";



    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(false);

        var usersPromise = usersService.getAllUsers();

        usersPromise.then(function(usersResult) {
            $scope.users = usersResult;
            $scope.filteredUsers = angular.copy(usersResult);
        });

        var citiesPromise = citiesService.getCities(true);
        citiesPromise.then(function(citiesResult) {
            $scope.cities = citiesResult;
            $scope.filteredCities = angular.copy(citiesResult);
        });

        var allRolesByIdsPromise = rolesService.getAllRolesByIds(true);


        var residentsPromise = residentsService.getAllResidents();
        $q.all([residentsPromise, allRolesByIdsPromise]).then(function(results) {
            var residentsResult = results[0];

            $scope.residents = residentsResult;
            $scope.filteredResidents = angular.copy(residentsResult);

            $scope.allRolesByIds = results[1];
        });

        var actionsPromise = actionsService.getAllActions();
        actionsPromise.then(function(actionsResult) {
            $scope.actions = actionsResult;
            $scope.filteredActions = angular.copy(actionsResult);
        });
    }

});