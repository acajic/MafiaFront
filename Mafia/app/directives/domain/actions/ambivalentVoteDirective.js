app.directive('ambivalentVote', function($timeout, actionsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actions/ambivalentVote.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.voteOnSelect = function(selectedResident) {
                if (!selectedResident)
                    return;


                var postActionPromise = actionsService.postAction(scope.city.id,
                    scope.resident.role.id,
                    ACTION_TYPE_ID_AMBIVALENT_VOTE,
                    scope.city.current_day_id,
                    { target_id : selectedResident.id });

                postActionPromise.then(function() {
                    $timeout(function() {
                        scope.infos = [{type:"success", msg: "Voted for " + selectedResident.name + "."}];
                    });
                }, function(reason, ee) {
                    scope.infos = [{type:"danger", msg: reason}];
                })

            };

            scope.closeInfoAlert = function(index) {
                scope.infos.splice(index, 1);
            };

            scope.cancelUnprocessedActions = function() {
                var cancelUnprocessedActionsPromise = actionsService.cancelUnprocessedActions(scope.city.id, scope.resident.role.id, ACTION_TYPE_ID_AMBIVALENT_VOTE);


                cancelUnprocessedActionsPromise.then(function() {
                    scope.infos = [{type:"success", msg: "Canceled unprocessed actions."}];
                }, function(reason) {
                    if (reason.httpObj.responseJSON) {
                        angular.forEach(reason.httpObj.responseJSON, function(error) {
                            scope.infos.push({type : 'danger', msg: error });
                        });
                    } else {
                        scope.infos.push({type : 'danger', msg: "Failed to cancel actions." });
                    }
                });
            };

        }
    };
});