app.directive('actionResult', function($compile, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city : '=',
            roleId : '=',
            resident : '=',
            actionResult: '=',
            actionResults: '=',
            editMode: '=',
            isNew: '=',
            hide: '='
        },
        templateUrl: 'app/directiveTemplates/domain/actionResult.html',
        compile: function (element, attrs) {
            var actionResultDirectivesByActionResultTypeId = {};
            // var voteResultDirective = element.find( "vote-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_VOTE] = '<vote-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_VOTE" ></vote-result>';//voteResultDirective;
            // var voteMafiaResultDirective = element.find( "vote-mafia-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_VOTE_MAFIA] = '<vote-mafia-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_VOTE_MAFIA"></vote-mafia-result>';// voteMafiaResultDirective;
            // var sheriffIdentitiesResultDirective = element.find( "sheriff-identities-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES] = '<sheriff-identities-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_SHERIFF_IDENTITIES"></sheriff-identities-result>';
            // var terroristBombResultDirective = element.find( "terrorist-bomb-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_TERRORIST_BOMB] = '<terrorist-bomb-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_TERRORIST_BOMB"></terrorist-bomb-result>';
            // var residentBecameSheriffResultDirective = element.find( "resident-became-sheriff-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF] = '<resident-became-sheriff-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_SHERIFF"></resident-became-sheriff-result>';
            // var residentBecameDeputyResultDirective = element.find( "resident-became-deputy-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY] = '<resident-became-deputy-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_RESIDENT_BECAME_DEPUTY"></resident-became-deputy-result>';
            // var revivalOccuredResultDirective = element.find( "revival-occurred-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED] = '<revival-occurred-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_REVIVAL_OCCURRED"></revival-occurred-result>';
            // var revivalRevealedResultDirective = element.find( "revival-revealed-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED] = '<revival-revealed-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_REVIVAL_REVEALED"></revival-revealed-result>';

            // var investigateResultDirective = element.find( "investigate-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_INVESTIGATE] = '<investigate-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_INVESTIGATE"></investigate-result>';
            // var protectResultDirective = element.find( "protect-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_PROTECT] = '<protect-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_PROTECT"></protect-result>';
            // var tellerVotesResultDirective = element.find( "teller-votes-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_TELLER_VOTES] = '<teller-votes-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_TELLER_VOTES"></teller-votes-result>';
            // var mafiaMembersResultDirective = element.find( "mafia-members-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS] = '<mafia-members-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_SINGLE_REQUIRED_MAFIA_MEMBERS"></mafia-members-result>';
            // var journalistInvestigateResultDirective = element.find( "journalist-investigate-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE] = '<journalist-investigate-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_JOURNALIST_INVESTIGATE"></journalist-investigate-result>';
            // var deputyIdentitiesResultDirective = element.find( "deputy-identities-result" );
            actionResultDirectivesByActionResultTypeId[ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES] = '<deputy-identities-result ng-if="actionResult && actionResult.action_result_type.id == actionResultTypeIds.ACTION_RESULT_TYPE_ID_DEPUTY_IDENTITIES"></deputy-identities-result>';



            return {
                pre: function (scope, element, attrs) {

                },
                post: function (scope, element, attrs) {
                    "use strict";

                    scope.actionResultTypeIds = actionResultsService.actionResultTypeIds;

                    var actionResultTypeId = scope.actionResult.action_result_type.id;
                    var actionResultDiv = element.find('.action-result');

                    if (actionResultDirectivesByActionResultTypeId[actionResultTypeId]) {
                        var actionResultDirective = actionResultDirectivesByActionResultTypeId[actionResultTypeId];
                        var transcludeActionResultDirective = $compile( actionResultDirective );
                        transcludeActionResultDirective(scope, function( actionResultDirectiveClone ) {
                            actionResultDiv.append( actionResultDirectiveClone );
                        });
                    }


                }
            };
        }
    };
});