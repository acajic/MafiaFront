app.directive('specialActions', function($compile, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId: '=',
            resident : '=',
            actionResults: '=',
            actionResultsByType: '='
        },
        templateUrl: 'app/directiveTemplates/domain/specialActions.html',
        compile: function (element, attrs) {
            "use strict";

            var actionDirectiveForActionTypeId = {};
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_INVESTIGATE] = '<investigate ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_INVESTIGATE]"></investigate>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_PROTECT] = '<protect ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_PROTECT]"></protect>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_TELLER_VOTES] = '<teller-votes ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_TELLER_VOTES]"> </teller-votes>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_VOTE_MAFIA] = '<vote-mafia ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_VOTE_MAFIA]"></vote-mafia>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_SHERIFF_IDENTITIES] = '<sheriff-identities ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_SHERIFF_IDENTITIES]"></sheriff-identities>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_TERRORIST_BOMB] = '<terrorist-bomb ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_TERRORIST_BOMB]"></terrorist-bomb>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_JOURNALIST_INVESTIGATE] = '<journalist-investigate ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_JOURNALIST_INVESTIGATE]"></journalist-investigate>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_DEPUTY_IDENTITIES] = '<deputy-identities ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_DEPUTY_IDENTITIES]"></deputy-identities>';
            actionDirectiveForActionTypeId[ACTION_TYPE_ID_INITIATE_REVIVAL] = '<initiate-revival ng-if="showingActionTypes[actionTypeIds.ACTION_TYPE_ID_INITIATE_REVIVAL]"></initiate-revival>';



            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    scope.actionTypeIds = actionsService.actionTypeIds;

                    // scope.selectedActionType = null;
                    // scope.actionTypeLabel = "Select action type";
                    scope.actionTypes = [];

                    function init() {
                        var role = scope.city.rolesById[scope.roleId].role;

                        var showingActionTypes = {};

                        if (role.action_types.length > 0) {
                            scope.actionTypes = $.grep(role.action_types, function (someActionType) {
                                return !someActionType.is_single_required && // eliminates ActionType::SingleRequired::MafiaMembers, ActionType::SingleRequired::Residents
                                    someActionType.id != ACTION_TYPE_ID_VOTE &&
                                    someActionType.id != ACTION_TYPE_ID_ELDER_VOTE &&
                                    someActionType.id != ACTION_TYPE_ID_FORGER_VOTE
                            });
                            if (scope.actionTypes.length > 0) {


                                angular.forEach(scope.actionTypes, function(someActionType) {
                                    showingActionTypes[someActionType.id] = true;
                                });
                                scope.showingActionTypes = showingActionTypes;
                            } else {
                                scope.actionTypeLabel = "No special abilities";
                            }
                        }

                        var actionTypeParamsResult = scope.actionResultsByType[ACTION_RESULT_TYPE_ID_SELF_GENERATED_TYPE_ACTION_TYPE_PARAMS][0];
                        if (!actionTypeParamsResult) {
                            return;
                        }

                        scope.actionTypeParamsResult = actionTypeParamsResult;


                        var specialActionDiv = element.find('.special-action');
                        for (var actionTypeId in showingActionTypes) {
                            if (!actionTypeId || !showingActionTypes.hasOwnProperty(actionTypeId))
                                continue;

                            if (showingActionTypes[actionTypeId]) {
                                if (actionDirectiveForActionTypeId[actionTypeId]) {
                                    var actionDirective = actionDirectiveForActionTypeId[actionTypeId];
                                    var transcludeActionDirective = $compile( actionDirective );
                                    transcludeActionDirective(scope, function( actionDirectiveClone ) {
                                        specialActionDiv.append( actionDirectiveClone );
                                    });
                                }

                            }
                        }




                    }

                    init();
                }
            };
        }
    };
});