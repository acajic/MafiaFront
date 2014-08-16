app.controller('AdminUserController',function ($scope, $routeParams, layoutService, usersService) {
    "use strict";

    init();

    function init() {
        layoutService.setHomeButtonVisible(true);
        layoutService.setAdminButtonVisible(true);

        var userId = $routeParams['user_id'];

    }

});