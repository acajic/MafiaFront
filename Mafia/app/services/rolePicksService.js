app.factory('rolePicksService', function(serverService) {
    "use strict";

    var getMyRolePicks = function(pageIndex, pageSize) {
        return serverService.get('role_picks/me', {
            pageIndex: pageIndex,
            pageSize: pageSize
        });
    };

    var createMyRolePick = function(city, role) {
        return serverService.post('role_picks/me', {
            role_pick: {
                city_id : city.id,
                role_id : role.id
            }
        });
    };

    var deleteRolePickById = function(rolePickId) {
        return serverService.delete('role_picks/' + rolePickId, {});
    };

    return {
        getMyRolePicks: getMyRolePicks,
        createMyRolePick: createMyRolePick,
        deleteRolePickById: deleteRolePickById
    };
});