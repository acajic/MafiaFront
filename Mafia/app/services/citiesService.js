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
            public: queryModel.public,
            resident_user_ids: queryModel.residentUserIds,
            user_creator: queryModel.userCreator, // this is userCreator username, not working atm
            timezone: queryModel.timezoneDate ? (queryModel.timezoneSign *(queryModel.timezoneDate.getHours() * 60 + queryModel.timezoneDate.getMinutes())) : null,
            active: queryModel.active,
            paused: queryModel.paused,
            paused_during_day: queryModel.pausedDuringDay,
            last_paused_at_min: queryModel.lastPausedAtMin ? queryModel.lastPausedAtMin.getTime()/1000 : null,
            last_paused_at_max: queryModel.lastPausedAtMax ? queryModel.lastPausedAtMax.getTime()/1000 : null,
            started_at_min: queryModel.startedAtMin ? queryModel.startedAtMin.getTime()/1000 : null,
            started_at_max: queryModel.startedAtMax ? queryModel.startedAtMax.getTime()/1000 : null,
            finished_at_min: queryModel.finishedAtMin ? queryModel.finishedAtMin.getTime()/1000 : null,
            finished_at_max: queryModel.finishedAtMax ? queryModel.finishedAtMax.getTime()/1000 : null,
            created_at_min: queryModel.createdAtMin ? queryModel.createdAtMin.getTime()/1000 : null,
            created_at_max: queryModel.createdAtMax ? queryModel.createdAtMax.getTime()/1000 : null,
            updated_at_min: queryModel.updatedAtMin ? queryModel.updatedAtMin.getTime()/1000 : null,
            updated_at_max: queryModel.updatedAtMax ? queryModel.updatedAtMax.getTime()/1000 : null
        });


        return citiesPromise.then(function(citiesResult) {
            return citiesResult;
        }, function(reason) {
            return reason;
        });

    };

    var getAllCitiesForSearch = function(searchText) {
        return serverService.get('cities/search/' + searchText, null);
    };

    var getMyCities = function(pageIndex, pageSize) {
        return serverService.get('cities/me', {
            page_index: pageIndex,
            page_size: pageSize
        });
    };

    var getMyCitiesForSearch = function(searchText) {
        return serverService.get('cities/me/search/' + searchText, null);
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





    var getCityPromisesByCityIds = {};

    var getCity = function(cityId, refresh) {
        if (!refresh && getCityPromisesByCityIds[cityId]) {
            return getCityPromisesByCityIds[cityId];
        }

        var cityPromise = serverService.get('cities/' + cityId);
        return cityPromise.then(function(cityResult) {
            cacheCity(cityResult);
            return cityResult;
        });
    };

    function cacheCity(cityUpdated) {
        var deferred = $q.defer();
        getCityPromisesByCityIds[cityUpdated.id] = deferred.promise;
        deferred.resolve(cityUpdated);

        var city = $.grep(cities, function(someCity) {
            return someCity.id == cityUpdated.id;
        });
        if (city) {
            var index = cities.indexOf(city);
            if (index >= 0)
                cities.splice(index, 1, cityUpdated);
            else
                cities.push(cityUpdated);
        }
    }

    function deleteAllCachedCities() {
        getCityPromisesByCityIds = {};
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
        }).then(function(createdCity) {
            cacheCity(createdCity);
            return createdCity;
        });
    };

    var inviteUsers = function(cityId, invitedUsers) {
        return serverService.post('cities/' + cityId + '/invite', {
            invited_users: invitedUsers
        });
    };

    var cancelInvitation = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/invitation/' + userId);
    };

    var acceptInvitation = function(cityId) {
        return serverService.post('cities/' + cityId + '/accept_invitation');
    };

    var acceptJoinRequest = function(cityId, userId) {
        return serverService.post('cities/' + cityId + '/join_request/' + userId);
    };

    var rejectJoinRequest = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/join_request/' + userId);
    };

    var kickUser = function(cityId, userId) {
        return serverService.delete('cities/' + cityId + '/user/' + userId);
    };


    var deleteCity = function (cityId, password) {
        return serverService.delete('cities/'+cityId, {
            password: password
        });
    };

    var updateCity = function (city) {
        return serverService.put('cities/' + city.id, {city : city}).then(function(updatedCity) {

            return updatedCity;
        });
    };

    var joinCity = function(cityId, joinCityPassword) {
        var joinCityPromise = serverService.post('cities/' + cityId + '/join', {password : joinCityPassword});

        joinCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });

        return joinCityPromise;
    };

    var leaveCity = function(cityId) {
        var leaveCityPromise = serverService.post('cities/' + cityId + '/leave');
        leaveCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
        });

        return leaveCityPromise;
    };

    var cancelJoinRequest = function(cityId) {
        var cancelJoinRequestPromise = serverService.delete('cities/' + cityId + '/join_request');
        cancelJoinRequestPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
        });

        return cancelJoinRequestPromise;
    };

    var startCity = function(cityId) {
        var startCityPromise = serverService.post('cities/' + cityId + '/start');
        return startCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var pauseCity = function(cityId) {
        var pauseCityPromise = serverService.post('cities/' + cityId + '/pause');
        return pauseCityPromise.then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var resumeCity = function(cityId) {
        return serverService.post('cities/' + cityId + "/resume").then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });
    };

    var triggerDayStart = function(cityId) {
        return serverService.post('cities/' + cityId + '/trigger_day_start').then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });;
    };

    var triggerNightStart = function(cityId) {
        return serverService.post('cities/' + cityId + '/trigger_night_start').then(function(cityUpdated) {
            cacheCity(cityUpdated);
            return cityUpdated;
        });;
    };


    var minutesToString = function(minutes) {
        return pad(Math.floor(minutes / 60.0), 2) + ":" + pad(minutes%60, 2);
    };

    var pad = function(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    };

    var isNewCityCreated = false;
    var cityDeleted = null;

    return {
        getAllCities : getAllCities,
        getAllCitiesForSearch : getAllCitiesForSearch,
        getMyCities : getMyCities,
        getMyCitiesForSearch : getMyCitiesForSearch,
        cities : cities,
        getCity : getCity,
        cacheCity: cacheCity,
        deleteAllCachedCities: deleteAllCachedCities,
        getCities : getCities,
        newCity : newCity,
        getNewCity : getNewCity,
        createCity : createCity,
        inviteUsers : inviteUsers,
        cancelInvitation : cancelInvitation,
        acceptInvitation : acceptInvitation,
        acceptJoinRequest : acceptJoinRequest,
        rejectJoinRequest : rejectJoinRequest,
        kickUser : kickUser,
        deleteCity : deleteCity,
        updateCity : updateCity,
        joinCity : joinCity,
        leaveCity : leaveCity,
        cancelJoinRequest : cancelJoinRequest,
        startCity : startCity,
        pauseCity : pauseCity,
        resumeCity : resumeCity,
        triggerDayStart : triggerDayStart,
        triggerNightStart : triggerNightStart,
        minutesToString : minutesToString,
        isNewCityCreated : isNewCityCreated,
        cityDeleted : cityDeleted
    };
});