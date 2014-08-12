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
var ACTION_RESULT_TYPE_ID_SILENT_SHERIFF_IDENTITIES = 12;
var ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SILENT_SHERIFF = 13;

var ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS = 14;
var ACTION_RESULT_TYPE_ID_GAME_OVER = 15;


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
        ACTION_RESULT_TYPE_ID_SILENT_SHERIFF_IDENTITIES : ACTION_RESULT_TYPE_ID_SILENT_SHERIFF_IDENTITIES,
        ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SILENT_SHERIFF : ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SILENT_SHERIFF,
        ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS : ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS,
        ACTION_RESULT_TYPE_ID_GAME_OVER : ACTION_RESULT_TYPE_ID_GAME_OVER
    };

    var privateActionResultTypesForRole = function(role) {
        var supportedActionResultTypes = $.map(role.action_types, function(someActionType) {
            if (someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_RESIDENTS ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_TERRORIST_BOMB ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_VOTE_MAFIA ||
                someActionType.action_result_type.id == ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES
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

        if (city.rolesById[ROLE_ID_SHERIFF] && city.rolesById[ROLE_ID_SHERIFF].quantity > 0)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES);

        if (city.rolesById[ROLE_ID_TERRORIST] && city.rolesById[ROLE_ID_TERRORIST].quantity > 0)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_TERRORIST_BOMB);

        if (city.rolesById[ROLE_ID_SHERIFF] && city.rolesById[ROLE_ID_SHERIFF].quantity > 0)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF);

        if (city.rolesById[ROLE_ID_SILENT_SHERIFF] && city.rolesById[ROLE_ID_SILENT_SHERIFF].quantity > 0)
            publicActionResultTypeIds.push(ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SILENT_SHERIFF);

        return publicActionResultTypeIds;
    };


    var getAllActionResults = function() {
        return serverService.get('action_results', {});
    };

    var actionResultsForCities = {};

    var getActionResults = function(cityId, roleId, refresh) {
        if (refresh || !actionResultsForCities[cityId]) {
            var actionResultsPromise = serverService.get('action_results/city/'+ cityId + '/role/' + roleId, {});
            return actionResultsPromise.then(function(result) {
                actionResultsForCities[cityId] = result;
                return result;
            });
        } else {
            var deferred = $q.defer();
            deferred.resolve(actionResultsForCities[cityId]);
            return deferred.promise;
        }
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
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF
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
                    someActionResult.action_result_type.id == ACTION_RESULT_TYPE_ID_SILENT_SHERIFF_IDENTITIES
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

    getActionResultTypes();

    return {
        actionResultTypeIds : actionResultTypeIds,
        actionResultsForCities : actionResultsForCities,
        privateActionResultTypesForRole : privateActionResultTypesForRole,
        publicActionResultTypeIds : publicActionResultTypeIds,
        getAllActionResults : getAllActionResults,
        getActionResults : getActionResults,
        postActionResult : postActionResult,
        deleteActionResult : deleteActionResult,
        publicActionResults : publicActionResults,
        privateActionResults : privateActionResults,
        actionResultTypes : actionResultTypes,
        getActionResultTypes : getActionResultTypes
    };
});
