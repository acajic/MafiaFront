app.directive('cityTimer', function() {
    "use strict";
    return {
        restrict : 'E',
        scope: {
            city: '=',
            nextMoment: '=',
            onDayStart: '=',
            onNightStart: '='
        },
        controller: function($scope) {
            var lastMoment = null;

            var timeOffset = 0;

            $scope.editMode = false;
            $scope.lastMidnight = new Date().getTime();



            $scope.$on('timer-tick', timerTick);

            $scope.$on('timer-stopped', function() {
                // $scope.$broadcast('timer-start')
            });

            $scope.$watch('city', function(city) {
                if (!city)
                    return;

                initClock(city);
                initEarliestMoment(city);

            });

            function currentCityTime(city) {
                var date = new Date();
                var timezoneDifference = date.getTimezoneOffset()*60*1000 + city.timezone*60*1000;

                var timestampWithTimezone = date.getTime() + timezoneDifference;
                date.setTime(timestampWithTimezone);
                return date;
            }

            function initClock(city, offsetMillis) {
                var date = currentCityTime(city);
                if (!offsetMillis) {
                    offsetMillis = 0;
                }
                var timezoneDifference = date.getTimezoneOffset()*60*1000 + city.timezone*60*1000;

                var lastMidnight = date.getTime() - date.getHours()*60*60*1000 - date.getMinutes()*60*1000 - date.getSeconds()*1000 - date.getMilliseconds();
                lastMidnight -= timezoneDifference;

                lastMidnight -= offsetMillis; // for setting arbitrary time

                $scope.lastMidnight = lastMidnight;
            }

            var earliestMoment = {
                time : 24*60,
                isDayStart : true
            };
            var previousTickNextMoment = {};

            function initEarliestMoment(city) {
                for (var index in city.day_cycles) {
                    var dayCycle = city.day_cycles[index];
                    if (dayCycle.day_start - earliestMoment.time < 0) {
                        earliestMoment.time = dayCycle.day_start;
                        earliestMoment.isDayStart = true;
                    }
                    if (dayCycle.night_start - earliestMoment.time < 0) {
                        earliestMoment.time = dayCycle.night_start;
                        earliestMoment.isDayStart = false;
                    }
                }
            }

            // var previousTickTime = 0;

            function timerTick(evt) {
                var time = evt.targetScope.millis;

                if (!$scope.city) return;

                var timeInMinutes = time / (1000 * 60);

                if (timeInMinutes >= 24*60) {
                    initClock($scope.city);
                    timeInMinutes = timeInMinutes % (24*60);
                }

                var dayCycles = $scope.city.day_cycles;

                var nextMoment = {
                    time : 60*24,
                    isDayStart : false
                };
                var minimumDiff = 60*24;

                for (var index in dayCycles) {
                    var dayCycle = dayCycles[index];
                    var diff = nextMoment.time - dayCycle.day_start;
                    if (diff >= 0 && diff < minimumDiff && dayCycle.day_start > timeInMinutes) {
                        minimumDiff = diff;
                        nextMoment.time = dayCycle.day_start;
                        nextMoment.isDayStart = true;
                    }

                    diff = nextMoment.time - dayCycle.night_start;
                    if (diff >= 0 && diff < minimumDiff && dayCycle.night_start > timeInMinutes) {
                        minimumDiff = diff;
                        nextMoment.time = dayCycle.night_start;
                        nextMoment.isDayStart = false;
                    }
                }
                if (nextMoment.time == 24*60) {
                    nextMoment.time = earliestMoment.time;
                    nextMoment.isDayStart = earliestMoment.isDayStart;
                }


                if (previousTickNextMoment.time && previousTickNextMoment.time != nextMoment.time) {
                    // day start or night start happened while page was showing
                    $scope.refreshCountdownTicks = 10 + Math.floor(Math.random()*20);
                    lastMoment = previousTickNextMoment;
                    previousTickNextMoment = nextMoment;
                }


                if ($scope.refreshCountdownTicks == 1) {
                    if (lastMoment.isDayStart) {
                        $scope.onDayStart();
                    } else {
                        $scope.onNightStart();
                    }
                }

                $scope.refreshCountdownTicks = Math.max(0, $scope.refreshCountdownTicks-1);
                $scope.nextMoment.time = nextMoment.time;
                $scope.nextMoment.isDayStart = nextMoment.isDayStart;


            }

            $scope.toggleMode = function() {
                if ($scope.city.finished_at || !$scope.resident)
                    return;

                $scope.editMode = !$scope.editMode;

                if ($scope.editMode) {
                    var currentDate = new Date(new Date().getTime() + timeOffset);
                    $scope.time = {
                        hours : currentDate.getHours(),
                        minutes : currentDate.getMinutes(),
                        seconds : currentDate.getSeconds()
                    };
                }
            };

            $scope.setTime = function() {
                if ($scope.time.hours < 0 || $scope.time.hours > 23)
                    return;
                if ($scope.time.minutes < 0 || $scope.time.minutes > 59)
                    return;
                if ($scope.time.seconds < 0 || $scope.time.seconds > 59)
                    return;

                timeOffset = 0;
                var date = new Date();
                timeOffset += ($scope.time.hours - date.getHours()) * 60*60*1000;
                timeOffset += ($scope.time.minutes - date.getMinutes()) * 60 * 1000;
                timeOffset += ($scope.time.seconds - date.getSeconds()) * 1000;

                initClock($scope.city, timeOffset);
                $scope.editMode = false;
            };
        },
        templateUrl: 'app/directiveTemplates/domain/cityTimer.html',
        link: function(scope, element, attrs) {
            "use strict";
        }
    };
});