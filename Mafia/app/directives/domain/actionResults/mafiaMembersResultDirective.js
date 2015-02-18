app.directive('mafiaMembersResult', function($timeout, actionResultsService) {
    "use strict";
    return {
        restrict : 'E',
        templateUrl: 'app/directiveTemplates/domain/actionResults/mafiaMembersResult.html',
        link: function(scope, element, attrs) {
            "use strict";

            scope.mafiaMembers = [];

            function init() {
                var actionResult = scope.actionResult;
                var result = actionResult.result;

                if (!result) {
                    return;
                }

                var city = scope.city;

                scope.interpretation = "Mafia members";

                if (!result.mafia_members) {
                    return;
                }

                scope.mafiaMembers = $.map(result.mafia_members, function(someMafiaMemberResidentId) {
                    return angular.copy(city.residentsById[someMafiaMemberResidentId]);
                });




            }

            init();

            scope.toggleMode = function() {
                if (scope.city.finished_at || !scope.resident)
                    return;

                scope.editMode = !scope.editMode;
            };

            scope.selectResidentForIndex = function(index, resident) {
                scope.mafiaMembers.splice(index, 1, angular.copy(resident));
            };

            scope.removeMafiaMemberAtIndex = function(index) {
                scope.mafiaMembers.splice(index, 1);
            };

            scope.selectResidentToAdd = function(resident) {
                scope.mafiaMembers.push(angular.copy(resident));
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
                    });

                });
            };

            scope.submitActionResult = function () {


                var actionResult = {};

                angular.copy(scope.actionResult, actionResult);

                var submitActionResultPromise = actionResultsService.postActionResult(
                    scope.city.id,
                    null,
                    actionResult.action_result_type,
                    actionResult.action_id,
                    null,
                    {
                        mafia_members: $.map(scope.mafiaMembers, function(someResident) {
                            return someResident.id
                        })
                    }
                );
                submitActionResultPromise.then(function(createdActionResult) {
                    var index = scope.actionResults.indexOfMatchFunction(function(someActionResult) {
                        return someActionResult.id == scope.actionResult.id;
                    });

                    $timeout(function() {
                        if (index < 0) {
                            index = 0;
                            scope.actionResults.splice(0, 0, createdActionResult);
                        } else {
                            scope.actionResults.splice(index, 1, createdActionResult);
                        }
                        if (scope.isNew)
                            scope.hide();
                    });


                });
            };


        }
    };
});