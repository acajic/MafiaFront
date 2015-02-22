angular.module('ui.pointsAssign', [])
    .controller('PointsAssignController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {


        $scope.stateZero = angular.isDefined($attrs.stateZero) ? $scope.$parent.$eval($attrs.stateZero) : null;
        $scope.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : null;
        $scope.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : null;

        var defaultOptions = {
            stateOn: $scope.stateOn,
            stateOff: $scope.stateOff
        };

        var preloadedRateObjects = [];

        var preloadRateObjects = function (size) {
            preloadRateObjectsWithStates(new Array(size));
        };

        var preloadRateObjectsWithStates = function (states) {

            if (preloadedRateObjects.length < states.length+1) {
                if (preloadedRateObjects.length == 0) {
                    preloadedRateObjects.push(angular.extend({ index: 0 }, {stateOn: $scope.stateZero, stateOff: $scope.stateZero}, states[0]));
                }


                for (var i = preloadedRateObjects.length, n = states.length; i <= n; i++) {
                    preloadedRateObjects[i] = angular.extend({ index: i }, defaultOptions, states[i]);
                }

            } else {
                preloadedRateObjects = preloadedRateObjects.slice(0, states.length+1);
            }



        };

        var createRateObjects = function(size) {
            var states = preloadedRateObjects.slice(0, size+1);
            return states;
        };

        // Get objects used in template

        var init = function() {
            var unused = $scope.unused === undefined ? 0 : $scope.unused;
            $scope.val = $scope.value;

            preloadRateObjects($scope.max);


            $scope.range = createRateObjects(Math.max($scope.value, unused + $scope.value));
        };

        init();


        $scope.rate = function(value) {
            if ( $scope.value !== value && !$scope.readonly ) {
                $scope.value = value;
                $scope.val = value;

                $scope.onChange({roleId: $scope.pointAssignId, newQuantity: $scope.value});
            }
        };

        $scope.$watch('unused', function(newVal) {
            "use strict";
            preloadRateObjects($scope.max);
            init();
        });

        $scope.enter = function(value) {
            if ( ! $scope.readonly ) {
                $scope.val = value;
            }
        };

        $scope.reset = function() {
            $scope.val = $scope.value;
        };

        $scope.readonly = false;
        if ($attrs.readonly) {
            $scope.$parent.$watch($parse($attrs.readonly), function(value) {
                $scope.readonly = !!value;
            });
        }
    }])

    .directive('pointsAssign', function() {
        return {
            restrict: 'EA',
            scope: {
                value: '=',
                unused: '=',
                max: '=',
                pointAssignId: '@',
                onChange: '&'
            },
            controller: 'PointsAssignController',
            template: '<span ng-mouseleave="reset()">' +
                        '<i ng-repeat="r in range" ng-mouseenter="enter($index)" ng-click="rate($index)" class="glyphicon" ng-class="$index <= val && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')"></i>' +
                    '</span>',
            replace: true
        };
    });