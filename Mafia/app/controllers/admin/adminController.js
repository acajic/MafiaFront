var kAdminSelectedTabIndexCookieKey = 'admin_active_tabs';

var kAdminQueryModelUsers = 'admin_query_model_users';
var kAdminQueryModelCities = 'admin_query_model_cities';
var kAdminQueryModelResidents = 'admin_query_model_residents';
var kAdminQueryModelActions = 'admin_query_model_actions';
var kAdminQueryModelActionResults = 'admin_query_model_action_results';
var kAdminQueryModelDays = 'admin_query_model_days';
var kAdminQueryModelInitialAppRoles = 'admin_query_model_initial_app_roles';
var kAdminQueryModelGrantedAppRoles = 'admin_query_model_granted_app_roles';
var kAdminQueryModelPayments = 'admin_query_model_payments';
var kAdminQueryModelSubscriptions = 'admin_query_model_subscriptions';
var kAdminQueryModelGamePurchases = 'admin_query_model_game_purchases';
var kAdminQueryModelRolePickPurchases = 'admin_query_model_role_pick_purchases';


app.controller('AdminController',function ($scope, $q, $location, usersService, layoutService, citiesService, authService, appRolesService, paymentsService, subscriptionsService, gamePurchasesService, rolePickPurchasesService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(false);

        $scope.appPermissions = usersService.appPermissions;

        var userMePromise = authService.userMe(false);
        userMePromise.then(function(userMeResult) {
            $scope.userMe = userMeResult;
        }, function (reason) {
            // ignore
        });

        $scope.alerts = [];

        var tabActive = layoutService.adminTabsActive;
        if (!tabActive) {
            tabActive = {0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false};
        }
        $scope.tabActive = tabActive;

        var usersQueryModelJson = getCookie(kAdminQueryModelUsers);
        if (usersQueryModelJson) {
            $scope.usersQueryModel = JSON.parse(usersQueryModelJson);
            convertTimestampsToDates($scope.usersQueryModel);
        }

        var citiesQueryModelJson = getCookie(kAdminQueryModelCities);
        if (citiesQueryModelJson) {
            $scope.citiesQueryModel = JSON.parse(citiesQueryModelJson);
            convertTimestampsToDates($scope.citiesQueryModel);
            $scope.citiesQueryModel['timezoneDate'] = $scope.citiesQueryModel['timezoneDate'] ? new Date($scope.citiesQueryModel['startedAtMin']) : null;
            $scope.citiesQueryModel['startedAtMin'] = $scope.citiesQueryModel['startedAtMin'] ? new Date($scope.citiesQueryModel['startedAtMin']) : null;
            $scope.citiesQueryModel['startedAtMax'] = $scope.citiesQueryModel['startedAtMax'] ? new Date($scope.citiesQueryModel['startedAtMax']) : null;
            $scope.citiesQueryModel['lastPausedAtMin'] = $scope.citiesQueryModel['lastPausedAtMin'] ? new Date($scope.citiesQueryModel['lastPausedAtMin']) : null;
            $scope.citiesQueryModel['lastPausedAtMax'] = $scope.citiesQueryModel['lastPausedAtMax'] ? new Date($scope.citiesQueryModel['lastPausedAtMax']) : null;
            $scope.citiesQueryModel['finishedAtMin'] = $scope.citiesQueryModel['finishedAtMin'] ? new Date($scope.citiesQueryModel['finishedAtMin']) : null;
            $scope.citiesQueryModel['finishedAtMax'] = $scope.citiesQueryModel['finishedAtMax'] ? new Date($scope.citiesQueryModel['finishedAtMax']) : null;
        }

        var residentsQueryModelJson = getCookie(kAdminQueryModelResidents);
        if (residentsQueryModelJson) {
            $scope.residentsQueryModel = JSON.parse(residentsQueryModelJson);
            convertTimestampsToDates($scope.residentsQueryModel);
        }

        var actionsQueryModelJson = getCookie(kAdminQueryModelActions);
        if (actionsQueryModelJson) {
            $scope.actionsQueryModel = JSON.parse(actionsQueryModelJson);
            convertTimestampsToDates($scope.actionsQueryModel);
        }

        var actionResultsQueryModelJson = getCookie(kAdminQueryModelActionResults);
        if (actionResultsQueryModelJson) {
            $scope.actionResultsQueryModel = JSON.parse(actionResultsQueryModelJson);
            convertTimestampsToDates($scope.actionResultsQueryModel);
        }

        var daysQueryModelJson = getCookie(kAdminQueryModelDays);
        if (daysQueryModelJson) {
            $scope.daysQueryModel = JSON.parse(daysQueryModelJson);
            convertTimestampsToDates($scope.daysQueryModel);
        }

        var initialAppRolesQueryModelJson = getCookie(kAdminQueryModelInitialAppRoles);
        if (initialAppRolesQueryModelJson) {
            $scope.initialAppRolesQueryModel = JSON.parse(initialAppRolesQueryModelJson);
            convertTimestampsToDates($scope.initialAppRolesQueryModel);
        }

        var paymentsQueryModelJson = getCookie(kAdminQueryModelPayments);
        if (paymentsQueryModelJson) {
            $scope.paymentsQueryModel = JSON.parse(paymentsQueryModelJson);
            convertTimestampsToDates($scope.paymentsQueryModel);
        }

        var subscriptionsQueryModelJson = getCookie(kAdminQueryModelSubscriptions);
        if (subscriptionsQueryModelJson) {
            $scope.subscriptionsQueryModel = JSON.parse(subscriptionsQueryModelJson);
            convertTimestampsToDates($scope.subscriptionsQueryModel);
        }

        var gamePurchasesQueryModelJson = getCookie(kAdminQueryModelGamePurchases);
        if (gamePurchasesQueryModelJson) {
            $scope.gamePurchasesQueryModel = JSON.parse(gamePurchasesQueryModelJson);
            convertTimestampsToDates($scope.gamePurchasesQueryModel);
        }

        var rolePickPurchasesQueryModelJson = getCookie(kAdminQueryModelRolePickPurchases);
        if (rolePickPurchasesQueryModelJson) {
            $scope.rolePickPurchasesQueryModel = JSON.parse(rolePickPurchasesQueryModelJson);
            convertTimestampsToDates($scope.rolePickPurchasesQueryModel);
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

        if (paymentsService.notifications.paymentLogDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted payment log for user with email '" + paymentsService.notifications.paymentLogDeleted.user_email + "'"});
            paymentsService.notifications.paymentLogDeleted = null;
        }

        if (subscriptionsService.notifications.subscriptionPurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted subscription purchase for user with email '" + subscriptionsService.notifications.subscriptionPurchaseDeleted.user_email + "'"});
            subscriptionsService.notifications.subscriptionPurchaseDeleted = null;
        }

        if (gamePurchasesService.notifications.gamePurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted game purchase for user with email '" + gamePurchasesService.notifications.gamePurchaseDeleted.user_email + "'"});
            gamePurchasesService.notifications.gamePurchaseDeleted = null;
        }

        if (rolePickPurchasesService.notifications.rolePickPurchaseDeleted) {
            $scope.alerts.push({type: 'success', msg: "Successfully deleted role pick purchase for user with email '" + rolePickPurchasesService.notifications.rolePickPurchaseDeleted.user_email + "'"});
            rolePickPurchasesService.notifications.rolePickPurchaseDeleted = null;
        }

    }


    $scope.tabSelected = function() {
        layoutService.adminTabsActive = $scope.tabActive;
    };


    function convertTimestampsToDates(queryModel) {
        queryModel['createdAtMin'] = queryModel['createdAtMin'] ? new Date(queryModel['createdAtMin']) : null;
        queryModel['createdAtMax'] = queryModel['createdAtMax'] ? new Date(queryModel['createdAtMax']) : null;
        queryModel['updatedAtMin'] = queryModel['updatedAtMin'] ? new Date(queryModel['updatedAtMin']) : null;
        queryModel['updatedAtMax'] = queryModel['updatedAtMax'] ? new Date(queryModel['updatedAtMax']) : null;
    }

});