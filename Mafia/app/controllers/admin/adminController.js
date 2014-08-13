app.controller('AdminController',function ($scope, $q, usersService, citiesService, residentsService, actionsService, rolesService, actionResultsService, authService, modalService, $location, layoutService) {
    "use strict";



    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(false);



        var actionResultsPromise = actionResultsService.getAllActionResults();
        actionResultsPromise.then(function(actionResultsResult) {
            $scope.actionResults = actionResultsResult;
            $scope.filteredActionResults = angular.copy(actionResultsResult);
        });
    }

});