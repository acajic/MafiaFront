/**
 * Created by Andro on 29.12.2014..
 */
app.controller('UnsubscribeController', function ($scope, usersService) {
    "use strict";

    $scope.alerts = [];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.unsubscribe = function() {
        if (!$scope.email) {
            $scope.alerts.push({type: 'danger', msg: 'Enter email'});
            return;
        }

        var unsubscribePromise = usersService.unsubscribeEmail($scope.email);
        unsubscribePromise.then(function(result) {
            $scope.alerts.push({type: 'success', msg: "Successfully unsubscribed '" + $scope.email + "'." });
        }, function(reason) {
            var additionalText = reason.httpObj.responseText;
            if (!additionalText)
                additionalText = "We suggest you send an email to " + usersService.supportEmail + " with title 'unsubscribe' and you will no longer receive any emails from this site.";
            $scope.alerts.push({type: 'danger', msg: "Failed to unsubscribe. " + additionalText  });
        });
    };

});