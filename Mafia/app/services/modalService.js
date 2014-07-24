app.factory('modalService', function($modal) {
    "use strict";

    var controller = function ($scope, $modalInstance, message) {
        $scope.message = message;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var successModal = function(message) {
        $modal.open({
            templateUrl: 'app/partials/modal/success.html',
            controller: controller,
            resolve: {
                message: function () {
                    return message;
                }
            }
        });
    };

    var errorModal = function(message) {
        $modal.open({
            templateUrl: 'app/partials/modal/error.html',
            controller: controller,
            resolve: {
                message: function () {
                    return message;
                }
            }
        });
    };

    return {
        successModal : successModal,
        errorModal : errorModal
    };
});