app.directive('tellerVotesResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/tellerVotesResult.html',
        link: function(scope, element, attrs) {
            "use strict";


            scope.outcome = {
                success : false
            };

            scope.actionResultCopied = {};

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;
                if (!actionResult)
                    return;

                var votesCountPerResidentId = result.votes_count;

                var city = scope.city;

                if (!city)
                    return;
                if (!actionResult.id) {
                    scope.actionResultCopied = {
                        action_result_type: {
                            id: ACTION_RESULT_TYPE_ID_TELLER_VOTES
                        },
                        day: city.current_day
                    };
                } else {
                    angular.copy(scope.actionResult, scope.actionResultCopied);
                    scope.actionResultCopied.day = $.grep(city.days, function(someDay) {
                        return someDay.id == scope.actionResultCopied.day_id;
                    })[0];
                }



                var votesCountPerResident = [];
                for (var residentId in votesCountPerResidentId) {
                    var resident = city.residentsById[residentId];
                    var voteCount = votesCountPerResidentId[residentId];
                    votesCountPerResident.push({
                        resident : resident,
                        voteCount : voteCount
                    });
                };

                scope.interpretation = "Yesterday's public voting results:";
                scope.votesCountPerResident = votesCountPerResident;
                var votesCountPerResidentCopied = [];
                angular.copy(votesCountPerResident, votesCountPerResidentCopied);
                scope.votesCountPerResidentCopied = votesCountPerResidentCopied;
            }

            init();



            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectResident = function(selectedOption) {
                scope.addedResidentVoteCount.resident = selectedOption;
            };

            scope.addedResidentVoteCount = {};


            scope.addVoteCountForResident = function() {
                if (!scope.addedResidentVoteCount.resident || !scope.addedResidentVoteCount.voteCount || !scope.addedResidentVoteCount.resident.id)
                    return;

                var addedResidentVoteCount = {};
                angular.copy(scope.addedResidentVoteCount, addedResidentVoteCount);
                scope.addedResidentVoteCount = {};

                var indexOfResident = scope.votesCountPerResidentCopied.indexOfMatchFunction(function(someResidentVoteCount) {
                    return someResidentVoteCount.resident.id == addedResidentVoteCount.resident.id;
                });
                if (indexOfResident < 0) {
                    for (var i = 0; i<scope.votesCountPerResidentCopied.length; i++) {
                        if (scope.votesCountPerResidentCopied[i].resident.id > addedResidentVoteCount.resident.id)
                            break;
                    }
                    scope.votesCountPerResidentCopied.splice(i, 0, addedResidentVoteCount);

                } else {
                    scope.votesCountPerResidentCopied[indexOfResident].voteCount = addedResidentVoteCount.voteCount;
                }

            };

            scope.removeVoteCount = function (index) {
                scope.votesCountPerResidentCopied.splice(index, 1);
            };

            scope.blankActionResult = function() {
                scope.investigatedResident = null;
            };

            scope.deleteActionResult = function() {
                var deleteActionResultPromise = actionResultsService.deleteActionResult(scope.actionResult.id);
                deleteActionResultPromise.then(function() {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0)
                        return;

                    $timeout(function() {
                        scope.actionResults.splice(index, 1);
                        scope.editMode = false;
                    });

                });
            };

            scope.submitActionResult = function() {
                var residentVoteCounts = {};
                angular.forEach(scope.votesCountPerResidentCopied, function(someResidentVoteCount) {
                    residentVoteCounts[someResidentVoteCount.resident.id] = someResidentVoteCount.voteCount;
                });


                var postActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    scope.roleId,
                    scope.actionResultCopied.action_result_type,
                    scope.actionResultCopied.action_id,
                    scope.actionResultCopied.day.id,
                    {
                        success : true,
                        votes_count : residentVoteCounts
                    }
                );

                postActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    if (index < 0) {
                        index = 0;
                        scope.actionResults.splice(0, 0, createdActionResult);
                    } else {
                        scope.actionResults.splice(index, 1, createdActionResult);
                    }

                    scope.actionResult = createdActionResult;
                    init();


                    $timeout(function() {
                        if (scope.isNew)
                            scope.hide();
                        else
                            scope.editMode = false;
                    });


                });
            };


        }
    };
});