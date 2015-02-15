var ACTION_RESULT_TYPE_ID_VOTE = 1;
var ACTION_RESULT_TYPE_ID_PROTECT = 2;
var ACTION_RESULT_TYPE_ID_INVESTIGATE = 3;
var ACTION_RESULT_TYPE_ID_VOTE_MAFIA = 4;
var ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES = 5;
var ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF = 6;


var ACTION_RESULT_TYPE_ID_TELLER_VOTES = 7;
var ACTION_RESULT_TYPE_ID_TERRORIST_BOMB = 8;
var ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS = 9;

var ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS = 10;
var ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE = 11;
var ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES = 12;
var ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY = 13;

var ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS = 14;
var ACTION_RESULT_TYPE_ID_GAME_OVER = 15;

var ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED = 17;
var ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED = 18;



var ACTION_RESULTS_DAYS_PER_PAGE = 7;

app.factory('actionResultsService', function($q, serverService) {
    "use strict";

    var actionResultTypeIds = {
        ACTION_RESULT_TYPE_ID_VOTE : ACTION_RESULT_TYPE_ID_VOTE,
        ACTION_RESULT_TYPE_ID_PROTECT : ACTION_RESULT_TYPE_ID_PROTECT,
        ACTION_RESULT_TYPE_ID_INVESTIGATE : ACTION_RESULT_TYPE_ID_INVESTIGATE,
        ACTION_RESULT_TYPE_ID_VOTE_MAFIA : ACTION_RESULT_TYPE_ID_VOTE_MAFIA,
        ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES : ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES,
        ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF : ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF,
        ACTION_RESULT_TYPE_ID_TELLER_VOTES : ACTION_RESULT_TYPE_ID_TELLER_VOTES,
        ACTION_RESULT_TYPE_ID_TERRORIST_BOMB : ACTION_RESULT_TYPE_ID_TERRORIST_BOMB,
        ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS : ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS,
        ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS : ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS,
        ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE : ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE,
        ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES : ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES,
        ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY : ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY,
        ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS : ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS,
        ACTION_RESULT_TYPE_ID_GAME_OVER : ACTION_RESULT_TYPE_ID_GAME_OVER,
        ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED : ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED,
        ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED : ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
    };

    var privateActionResultTypesForRole = function(role) {
        var supportedActionResultTypes = $.map(role.action_types, function(someActionType) {
            if (!someActionType.action_result_type)
                return null;

            if (someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_TERRORIST_BOMB ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE_MAFIA ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED
                ) {
                return null;
            }
            return someActionType.action_result_type;
        });
        return supportedActionResultTypes;
    };

    var publicActionResultTypeIds = function(city) {
        // for create public news feed result
        if (!city)
            return [];


        var publicActionResultTypeIds = [
            ACTION_RESULT_TYPE_ID_VOTE,
            ACTION_RESULT_TYPE_ID_VOTE_MAFIA];

        if (city.rolesById[ROLE_ID_SHERIFF]/* && city.rolesById[ROLE_ID_SHERIFF].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES);

        if (city.rolesById[ROLE_ID_TERRORIST]/* && city.rolesById[ROLE_ID_TERRORIST].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_TERRORIST_BOMB);

        if (city.rolesById[ROLE_ID_SHERIFF]/* && city.rolesById[ROLE_ID_SHERIFF].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF);

        if (city.rolesById[ROLE_ID_DEPUTY]/* && city.rolesById[ROLE_ID_DEPUTY].quantity > 0*/)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY);

        if (city.rolesById[ROLE_ID_NECROMANCER]/* && city.rolesById[ROLE_ID_NECROMANCER].quantity > 0*/) {
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED);
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED);
        }




        return publicActionResultTypeIds;
    };

    var actionResultTypes;
    var allActionResultTypesPromise;

    var getAllActionResultTypes = function(refresh) {
        if (refresh || !allActionResultTypesPromise) {
            allActionResultTypesPromise = serverService.get('action_result_types', {});
            allActionResultTypesPromise = allActionResultTypesPromise.then(function(allActionResultTypesResult) {
                actionResultTypes = allActionResultTypesResult;
                return actionResultTypes;
            });
        } else {

        }
        return allActionResultTypesPromise;
    };

    var getAllActionResultTypesByIds = function(refresh) {
          return getAllActionResultTypes(refresh).then(function(allActionResultTypesResult) {
              var actionResultTypesByIds = {};
              angular.forEach(allActionResultTypesResult, function(someActionResultType) {
                  actionResultTypesByIds[someActionResultType.id] = someActionResultType;
              });
              return actionResultTypesByIds;
          });
    };

    var getAllActionResults = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('action_results', {
            page_index: pageIndex,
            page_size: pageSize,
            action_ids: queryModel.actionIds,
            action_result_type_ids: queryModel.actionResultTypeIds,
            result_json: queryModel.resultJson,
            is_automatically_generated: queryModel.isAutomaticallyGenerated,
            city_ids: queryModel.cityIds,
            city_name: queryModel.cityName,
            day_number_min: queryModel.dayNumberMin,
            day_number_max: queryModel.dayNumberMax,
            resident_ids: queryModel.residentIds,
            resident_username: queryModel.residentUsername,
            for_all_residents: queryModel.forAllResidents,
            role_ids: queryModel.roleIds,
            deleted: queryModel.deleted,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });
    };



    var getActionResults = function(cityId, roleId, dayNumberMin, dayNumberMax) {
        return serverService.get('action_results/city/'+ cityId + '/role/' + roleId, {
            day_number_min: dayNumberMin,
            day_number_max: dayNumberMax
        });
    };

    var postActionResult = function(cityId, roleId, action_result_type, action_id, day_id, result) {
        return serverService.post('action_results', {
            action_result : {
                city_id : cityId,
                role_id : roleId,
                action_result_type : action_result_type,
                action_id : action_id,
                day_id : day_id,
                result : result
            }
        });
    };

    var deleteActionResult = function(actionResultId) {
        return serverService.delete('action_results/' + actionResultId);
    };

    var publicActionResults = function(actionResults) {

        function shouldShowSheriffIdentitiesResult(actionResult) {
            var result = actionResult.result;
            if (!result.success)
                return false;

            return result.success.toString() == 'true';
        }

        return $.grep(actionResults, function(someActionResult) {
            return (
                someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE_MAFIA ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_TERRORIST_BOMB ||
                    (someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES && shouldShowSheriffIdentitiesResult(someActionResult)) ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED
                );
        });
    };

    var privateActionResults = function(actionResults) {
        return $.grep(actionResults, function(someActionResult) {
            return (
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_PROTECT ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_INVESTIGATE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_TELLER_VOTES ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE ||
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES
                );
        });
    };

    var actionResultTypes = {};

    function isEmpty(ob){
        if (!ob)
            return false;

        for(var i in ob){ return false;}
        return true;
    }

    var getActionResultTypes = function(refresh) {
        if (!isEmpty(actionResultTypes) && !refresh) {
            var deferred = $q.defer();
            deferred.resolve(actionResultTypes);
            return deferred.promise;
        } else {
            var actionResultTypesPromise = serverService.get('action_result_types');

            return actionResultTypesPromise.then(function(actionResultTypesResult) {
                for (var i = 0; i < actionResultTypesResult.length; i++) {
                    var actionResultType = actionResultTypesResult[i];
                    actionResultTypes[actionResultType.id] = actionResultType;
                }

                return actionResultTypes;
            })
        }
    };



    var patchedActionResultsByType = function(actionResultsByTypeNew, actionResultsByTypeOld) {
        var patchedActionResultsByType = angular.copy(actionResultsByTypeNew);
        if (!actionResultsByTypeOld)
            return patchedActionResultsByType;

        var actionResultTypeIds = [ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS, ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS, ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS, ACTION_RESULT_TYPE_ID_GAME_OVER];

        for (var i = 0; i <actionResultTypeIds.length; i++) {
            var actionResultTypeId = actionResultTypeIds[i];
            var actionResultNew = actionResultsByTypeNew[actionResultTypeId] ? actionResultsByTypeNew[actionResultTypeId][0] : null;
            var actionResultOld = actionResultsByTypeOld[actionResultTypeId] ? actionResultsByTypeOld[actionResultTypeId][0] : null;

            if (!actionResultOld && !actionResultNew) {
                continue;
            }

            if (!actionResultOld && actionResultNew) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultNew];
                continue;
            }
            if (actionResultOld && !actionResultNew) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultOld];
                continue;
            }

            if (actionResultNew.day_id > actionResultOld.day_id) {
                patchedActionResultsByType[actionResultTypeId] = [actionResultNew];
            } else {
                patchedActionResultsByType[actionResultTypeId] = [actionResultOld];
            }
        }

        return patchedActionResultsByType;
    };



    return {
        actionResultTypeIds : actionResultTypeIds,
        privateActionResultTypesForRole : privateActionResultTypesForRole,
        publicActionResultTypeIds : publicActionResultTypeIds,
        actionResultTypes : actionResultTypes,
        getAllActionResultTypes : getAllActionResultTypes,
        getAllActionResultTypesByIds : getAllActionResultTypesByIds,
        getAllActionResults : getAllActionResults,
        getActionResults : getActionResults,
        postActionResult : postActionResult,
        deleteActionResult : deleteActionResult,
        publicActionResults : publicActionResults,
        privateActionResults : privateActionResults,
        patchedActionResultsByType : patchedActionResultsByType
    };
});
