app.factory('residentsService', function($q, serverService) {
    "use strict";

    var getAllResidents = function() {
        return serverService.get('residents/', {});
    };

    var getResidentMeForCityId = function(cityId) {
        return serverService.get('residents/me', {city_id : cityId});
    };

    var saveRoleForCityId = function(cityId, roleId) {
        return serverService.post('residents/save_role', {
            city_id : cityId,
            saved_role_id : roleId
        });
    };

    return {
        getAllResidents : getAllResidents,
        getResidentMeForCityId : getResidentMeForCityId,
        saveRoleForCityId : saveRoleForCityId
    };
});