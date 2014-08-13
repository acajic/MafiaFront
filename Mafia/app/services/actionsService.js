var ACTION_TYPE_ID_VOTE = 1;
var ACTION_TYPE_ID_PROTECT = 2;
var ACTION_TYPE_ID_INVESTIGATE = 3;
var ACTION_TYPE_ID_VOTE_MAFIA = 4;
var ACTION_TYPE_ID_SHERIFF_IDENTITIES = 5;
var ACTION_TYPE_ID_TELLER_VOTES = 6;
var ACTION_TYPE_ID_TERRORIST_BOMB = 7;
var ACTION_TYPE_ID_JOURNALIST_INVESTIGATE = 10;
var ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES = 11;
var ACTION_TYPE_ID_AMBIVALENT_VOTE = 12;

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
        ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES : ACTION_TYPE_ID_SILENT_SHERIFF_IDENTITIES,
        ACTION_TYPE_ID_AMBIVALENT_VOTE : ACTION_TYPE_ID_AMBIVALENT_VOTE
    };

    var getAllActions = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        return serverService.get('actions', {
            page_index: pageIndex,
            page_size: pageSize,
            resident_username: queryModel.residentUsername,
            role_ids: queryModel.roleIds,
            action_type_ids: queryModel.actionTypeIds,
            day_min: queryModel.dayMin,
            day_max: queryModel.dayMax,
            resident_alive: queryModel.residentAlive,
            is_processed: queryModel.isProcessed,
            created_at_min: queryModel.createdAtMin,
            created_at_max: queryModel.createdAtMax
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
        actionTypeIds: actionTypeIds,
        getAllActions: getAllActions,
        postAction: postAction,
        cancelUnprocessedActions: cancelUnprocessedActions
    };
});
