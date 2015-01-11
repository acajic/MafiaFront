app.factory('residentsService', function($q, serverService) {
    "use strict";

    var getAllResidents = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('residents/', {
            page_index: pageIndex,
            page_size: pageSize,
            user_ids: queryModel.userIds,
            username: queryModel.username,
            name: queryModel.name,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            role_ids: queryModel.roleIds,
            saved_role_ids: queryModel.savedRoleIds,
            role_seen: queryModel.roleSeen,
            alive: queryModel.alive,
            died_at_min: queryModel.diedAtMin,
            died_at_max: queryModel.diedAtMax,
            updated_at_min: queryModel.updatedAtMin,
            updated_at_max: queryModel.updatedAtMax
        });
    };

    /*
    var getResidentMeForCityId = function(cityId) {
        return serverService.get('residents/me', {city_id : cityId});
    };
    */

    var saveRoleForCityId = function(cityId, roleId) {
        return serverService.post('residents/save_role', {
            city_id : cityId,
            saved_role_id : roleId
        });
    };

    return {
        getAllResidents : getAllResidents,
        // getResidentMeForCityId : getResidentMeForCityId,
        saveRoleForCityId : saveRoleForCityId
    };
});