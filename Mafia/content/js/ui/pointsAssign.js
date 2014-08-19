angular.module('ui.pointsAssign', [])
    .controller('PointsAssignController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {

        // $scope.maxRange = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : 5;
        $scope.stateZero = angular.isDefined($attrs.stateZero) ? $scope.$parent.$eval($attrs.stateZero) : null;
        $scope.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : null;
        $scope.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : null;

        var createRateObjects = function(states) {
            var defaultOptions = {
                stateOn: $scope.stateOn,
                stateOff: $scope.stateOff
            };

            if (states.length == 0) {
                states[0] = angular.extend({ index: 0 }, {stateOn: $scope.stateZero, stateOff:$scope.stateZero}, states[0]);
                return states;
            }
            states[0] = angular.extend({ index: 0 }, {stateOn: $scope.stateZero, stateOff:$scope.stateZero}, states[0]);

            for (var i = 1, n = states.length; i <= n; i++) {
                states[i] = angular.extend({ index: i }, defaultOptions, states[i]);
            }
            return states;
        };

        // Get objects used in template

        var initRange = function() {
            $scope.range = angular.isDefined($attrs.ratingStates) ?  createRateObjects(angular.copy($scope.$parent.$eval($attrs.ratingStates))) : createRateObjects(new Array($scope.unused + $scope.value));
        };

        initRange();


        $scope.rate = function(value) {
            if ( $scope.value !== value && !$scope.readonly ) {
                $scope.value = value;

            }
        };

        $scope.$watch('unused', function(newVal) {
            "use strict";
            initRange();
        });

        $scope.enter = function(value) {
            if ( ! $scope.readonly ) {
                $scope.val = value;
            }
            $scope.onHover({value: value});
        };

        $scope.reset = function() {
            $scope.val = angular.copy($scope.value);
            $scope.onLeave();
        };

        $scope.$watch('value', function(value) {
            $scope.val = value;
        });

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
                onHover: '&',
                onLeave: '&'
            },
            controller: 'PointsAssignController',
            template: '<span ng-mouseleave="reset()">' +
                        '<i ng-repeat="r in range" ng-mouseenter="enter($index)" ng-click="rate($index)" class="glyphicon" ng-class="$index <= val && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')"></i>' +
                    '</span>',
            replace: true
        };
    });