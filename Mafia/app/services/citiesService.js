app.factory('citiesService', function($q, serverService) {
    "use strict";

    var cities = [];
    var newCity = {};

    var getAllCities = function(queryModel, pageIndex, pageSize) {
        if (!queryModel)
            queryModel = {};

        var citiesPromise = serverService.get('cities', {
            page_index: pageIndex,
            page_size: pageSize,
            name: queryModel.name,
            description: queryModel.description,
            user_creator: queryModel.userCreator,
            timezone: queryModel.timezoneDate ? (queryModel.timezoneSign *(queryModel.timezoneDate.getHours() * 60 + queryModel.timezoneDate.getMinutes())) : null,
            active: queryModel.active,
            paused: queryModel.paused,
            paused_during_day: queryModel.pausedDuringDay,
            last_paused_at_min: queryModel.lastPausedAtMin,
            last_paused_at_max: queryModel.lastPausedAtMax,
            started_at_min: queryModel.startedAtMin,
            started_at_max: queryModel.startedAtMax,
            finished_at_min: queryModel.finishedAtMin,
            finished_at_max: queryModel.finishedAtMax,
            created_at_min: queryModel.createdAtMin,
            created_at_max: queryModel.createdAtMax,
            updated_at_min: queryModel.updatedAtMin,
            updated_at_max: queryModel.updatedAtMax
        });


        return citiesPromise.then(function(citiesResult) {
            return citiesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getCities = function(refresh, pageIndex, pageSize) {
        if (refresh || this.cities == null || this.cities.length == 0 || (pageIndex*pageSize !== NaN && (pageIndex+1)*pageSize > this.cities.length ) ) {
            var citiesPromise = serverService.get('cities', {
                page_index: pageIndex,
                page_size: pageSize
            });

            return citiesPromise.then(function(citiesResult) {
                // refresh value of cities variable
                if (pageIndex !== undefined && pageSize) {
                    if (cities.length > pageIndex*pageSize) {
                        cities.splice(pageIndex*pageSize, Math.min(pageSize, cities.length - pageIndex*pageSize), citiesResult);
                    } else {
                        cities.push.apply(cities, citiesResult);
                    }
                } else {
                    angular.copy(citiesResult, cities);
                }
                return citiesResult;
            }, function(reason) {
                return reason;
            });
        } else {
            var deferred = $q.defer();
            if (pageIndex !== undefined && pageSize) {
                deferred.resolve(cities.slice(pageIndex*pageSize, (pageIndex+1)*pageSize));
            } else {
                deferred.resolve(cities);
            }
            return deferred.promise;
        }
    };

    var getCity = function(city_id, refresh) {
        if (!refresh) {
            var city = $.grep(cities, function(someCity) {
                return someCity.id == city_id;
            })[0];
            if (city) {
                var deferred = $q.defer();
                deferred.resolve(city);
                return deferred.promise;
            }
        }

        var cityPromise = serverService.get('cities/' + city_id);
        return cityPromise.then(function(cityResult) {
            updateCityInCollection(cityResult);
            return cityResult;
        });
    };

    function updateCityInCollection(cityUpdated) {
        var city = $.grep(cities, function(someCity) {
            return someCity.id == cityUpdated.id;
        });
        var index = cities.indexOf(city);
        cities.splice(index, 1, cityUpdated);
    }

    var getNewCity = function() {
        if (newCity.user_creator_id) {
            var deferred = $q.defer();
            deferred.resolve(newCity);
            return deferred.promise;
        } else {
            var newCityPromise = serverService.get('cities/new');
            return newCityPromise.then(function(newCityResult) {
                angular.copy(newCityResult, newCity);
                return newCityResult;
            }, function(reason) {
                return reason;
            });
        }
    };

    var createCity = function(city) {
        return serverService.post('cities', {
            city : city
        });
    };

    var inviteUsers = function(city_id, invitedUsers) {
        return serverService.post('cities/' + city_id + '/invite', {
            invited_users: invitedUsers
        });
    };


    var deleteCity = function (city_id, password) {
        return serverService.delete('cities/'+city_id, {
            password: password
        });
    };

    var updateCity = function (city) {
        return serverService.put('cities/' + city.id, {city : city});
    };

    var joinCity = function(city_id) {
        var joinCityPromise = serverService.post('cities/' + city_id + '/join');

        joinCityPromise.then(function(cityUpdated) {
            updateCityInCollection(cityUpdated);
            return cityUpdated;
        });

        return joinCityPromise;
    };

    var leaveCity = function(city_id) {
        var leaveCityPromise = serverService.post('cities/' + city_id + '/leave');
        leaveCityPromise.then(function(cityUpdated) {
            updateCityInCollection(cityUpdated);
        });

        return leaveCityPromise;
    };

    var startCity = function(city_id) {
        var startCityPromise = serverService.post('cities/' + city_id + '/start');
        return startCityPromise.then(function(cityUpdated) {
            updateCityInCollection(cityUpdated);
            return cityUpdated;
        });
    };

    var pauseCity = function(city_id) {
        var pauseCityPromise = serverService.post('cities/' + city_id + '/pause');
        return pauseCityPromise.then(function(cityUpdated) {
            updateCityInCollection(cityUpdated);
            return cityUpdated;
        });
    };

    var resumeCity = function(city_id) {
        return serverService.post('cities/' + city_id + "/resume").then(function(cityUpdated) {
            updateCityInCollection(cityUpdated);
            return cityUpdated;
        });
    };

    return {
        getAllCities : getAllCities,
        cities : cities,
        getCity : getCity,
        getCities : getCities,
        newCity : newCity,
        getNewCity : getNewCity,
        createCity : createCity,
        inviteUsers : inviteUsers,
        deleteCity : deleteCity,
        updateCity : updateCity,
        joinCity : joinCity,
        leaveCity : leaveCity,
        startCity : startCity,
        pauseCity : pauseCity,
        resumeCity : resumeCity
    };
});