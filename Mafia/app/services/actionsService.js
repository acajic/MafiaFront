var ACTION_TYPE_ID_VOTE = 1;
var ACTION_TYPE_ID_PROTECT = 2;
var ACTION_TYPE_ID_INVESTIGATE = 3;
var ACTION_TYPE_ID_VOTE_MAFIA = 4;
var ACTION_TYPE_ID_SHERIFF_IDENTITIES = 5;
var ACTION_TYPE_ID_TELLER_VOTES = 6;
var ACTION_TYPE_ID_TERRORIST_BOMB = 7;
var ACTION_TYPE_ID_JOURNALIST_INVESTIGATE = 10;
var ACTION_TYPE_ID_DEPUTY_IDENTITIES = 11;
var ACTION_TYPE_ID_ELDER_VOTE = 12;
var ACTION_TYPE_ID_INITIATE_REVIVAL = 13;
var ACTION_TYPE_ID_REVIVE = 14;
var ACTION_TYPE_ID_FORGER_VOTE = 15;



app.factory('actionsService', function($q, serverService) {
    "use strict";

    var actionTypeIds = {
        ACTION_TYPE_ID_VOTE : ACTION_TYPE_ID_VOTE,
        ACTION_TYPE_ID_PROTECT : ACTION_TYPE_ID_PROTECT,
        ACTION_TYPE_ID_INVESTIGATE : ACTION_TYPE_ID_INVESTIGATE,
        ACTION_TYPE_ID_VOTE_MAFIA : ACTION_TYPE_ID_VOTE_MAFIA,
        ACTION_TYPE_ID_SHERIFF_IDENTITIES : ACTION_TYPE_ID_SHERIFF_IDENTITIES,
        ACTION_TYPE_ID_TELLER_VOTES : ACTION_TYPE_ID_TELLER_VOTES,
        ACTION_TYPE_ID_TERRORIST_BOMB : ACTION_TYPE_ID_TERRORIST_BOMB,
        ACTION_TYPE_ID_JOURNALIST_INVESTIGATE : ACTION_TYPE_ID_JOURNALIST_INVESTIGATE,
        ACTION_TYPE_ID_DEPUTY_IDENTITIES : ACTION_TYPE_ID_DEPUTY_IDENTITIES,
        ACTION_TYPE_ID_ELDER_VOTE : ACTION_TYPE_ID_ELDER_VOTE,
        ACTION_TYPE_ID_INITIATE_REVIVAL : ACTION_TYPE_ID_INITIATE_REVIVAL,
        ACTION_TYPE_ID_REVIVE : ACTION_TYPE_ID_REVIVE,
        ACTION_TYPE_ID_FORGER_VOTE : ACTION_TYPE_ID_FORGER_VOTE
    };


    var actionTypes;
    var allActionTypesPromise;
    var getAllActionTypes = function(refresh) {
        if (refresh || !allActionTypesPromise) {
            allActionTypesPromise = serverService.get('action_type', {});
            allActionTypesPromise = allActionTypesPromise.then(function(allActionTypesResult) {
                actionTypes = allActionTypesResult;
                return actionTypes;
            });
        } else {

        }
        return allActionTypesPromise;
    };

    var getAllActionTypesByIds = function(refresh) {
        return getAllActionTypes(refresh).then(function(actionTypesResult) {
            var actionTypesByIds = {};
            angular.forEach(actionTypesResult, function(someActionType) {
                actionTypesByIds[someActionType.id] = someActionType;
            });
            return actionTypesByIds;
        });
    };

    var getAllActions = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('actions', {
            page_index: pageIndex,
            page_size: pageSize,
            username: queryModel.username,
            city_name: queryModel.cityName,
            input_json: queryModel.inputJson,
            role_ids: queryModel.roleIds,
            role_authentic: queryModel.roleAuthentic,
            action_type_ids: queryModel.actionTypeIds,
            day_min: queryModel.dayMin,
            day_max: queryModel.dayMax,
            resident_alive: queryModel.residentAlive,
            is_processed: queryModel.isProcessed,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null
        });
    };

    var postAction = function(cityId, roleId, actionTypeId, dayId, input) {
        return serverService.post('actions', {
            action_instance : {
                city_id : cityId,
                role_id : roleId,
                action_type_id : actionTypeId,
                day_id : dayId,
                input : input
            }
        });
    };

    var cancelUnprocessedActions = function(cityId, roleId, actionTypeId) {
        return serverService.delete('actions/cancel_unprocessed_actions', {
            city_id : cityId,
            role_id : roleId,
            action_type_id : actionTypeId
        });
    };

    return {
        actionTypes: actionTypes,
        getAllActionTypes: getAllActionTypes,
        getAllActionTypesByIds: getAllActionTypesByIds,
        actionTypeIds: actionTypeIds,
        getAllActions: getAllActions,
        postAction: postAction,
        cancelUnprocessedActions: cancelUnprocessedActions
    };
});
