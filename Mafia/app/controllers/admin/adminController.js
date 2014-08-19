var kAdminSelectedTabIndexCookieKey = 'admin_active_tabs';

var kAdminQueryModelUsers = 'admin_query_model_users';
var kAdminQueryModelCities = 'admin_query_model_cities';
var kAdminQueryModelResidents = 'admin_query_model_residents';
var kAdminQueryModelActions = 'admin_query_model_actions';
var kAdminQueryModelActionResults = 'admin_query_model_action_results';
var kAdminQueryModelDays = 'admin_query_model_days';
var kAdminQueryModelInitialAppRoles = 'admin_query_model_initial_app_roles';

app.controller('AdminController',function ($scope, $q, $location, usersService, layoutService, citiesService, authService, appRolesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(false);

        $scope.alerts = [];

        var tabActive = layoutService.adminTabsActive;
        if (!tabActive) {
            tabActive = {0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false};
        }
        $scope.tabActive = tabActive;

        var usersQueryModelJson = getCookie(kAdminQueryModelUsers);
        if (usersQueryModelJson) {
            $scope.usersQueryModel = JSON.parse(usersQueryModelJson);
        }

        var citiesQueryModelJson = getCookie(kAdminQueryModelCities);
        if (citiesQueryModelJson) {
            $scope.citiesQueryModel = JSON.parse(citiesQueryModelJson);
        }

        var residentsQueryModelJson = getCookie(kAdminQueryModelResidents);
        if (residentsQueryModelJson) {
            $scope.residentsQueryModel = JSON.parse(residentsQueryModelJson);
        }

        var actionsQueryModelJson = getCookie(kAdminQueryModelActions);
        if (actionsQueryModelJson) {
            $scope.actionsQueryModel = JSON.parse(actionsQueryModelJson);
        }

        var actionResultsQueryModelJson = getCookie(kAdminQueryModelActionResults);
        if (actionResultsQueryModelJson) {
            $scope.actionResultsQueryModel = JSON.parse(actionResultsQueryModelJson);
        }

        var daysQueryModelJson = getCookie(kAdminQueryModelDays);
        if (daysQueryModelJson) {
            $scope.daysQueryModel = JSON.parse(daysQueryModelJson);
        }

        var initialAppRolesQueryModelJson = getCookie(kAdminQueryModelInitialAppRoles);
        if (initialAppRolesQueryModelJson) {
            $scope.initialAppRolesQueryModel = JSON.parse(initialAppRolesQueryModelJson);
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };


        if (usersService.userDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted user '" + usersService.userDeleted.username + "'"});
            usersService.userDeleted = null;
        }
        if (citiesService.cityDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted city '" + citiesService.cityDeleted.name + "'"});
            citiesService.cityDeleted = null;
        }

        if (appRolesService.notifications.initialAppRoleDeleted) {
            if (appRolesService.notifications.initialAppRoleDeleted.email) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for user with email '" + appRolesService.notifications.initialAppRoleDeleted.email + "'"});
            } else if (appRolesService.notifications.initialAppRoleDeleted.email_pattern) {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role for users using emails that match '" + appRolesService.notifications.initialAppRoleDeleted.email_pattern + "'"});
            } else {
                $scope.alerts.push({type: 'success', msg: "Successfully deleted initial app role."});
            }

            appRolesService.notifications.initialAppRoleDeleted = null;
        }
    }


    $scope.tabSelected = function() {
        layoutService.adminTabsActive = $scope.tabActive;
    };

});