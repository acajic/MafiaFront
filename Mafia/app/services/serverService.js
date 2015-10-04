app.service('serverService', function ($q) {
    "use strict";

    var productionServer = 'http://188.226.245.205:3000';
    var developmentServer = 'http://localhost:3000';

    this.serverHost = developmentServer;



    var authTokenParamKey = 'auth_token';
    this.getAuthToken = function () {
        return getCookie(authTokenCookieKey);
    };
    this.setAuthToken = function (authToken, expirationDate) {
        setCookie(authTokenCookieKey, authToken, expirationDate);
    };

    this.get = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'GET',
            data: params,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.post = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'POST',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.put = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'PUT',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };

    this.delete = function (url, params) {
        params = params || {};
        params[authTokenParamKey] = this.getAuthToken();

        var deferred = $q.defer();

        $.ajax({
            url: this.serverHost + '/' + url,
            type: 'DELETE',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (httpObj, textStatus) {
                deferred.reject({httpObj : httpObj, textStatus : textStatus});
            }
        });

        return deferred.promise;
    };


    function handleUnauthorized(httpObj) {
        if (httpObj.status == 401) {
            this.setAuthToken("", null);
        }
    }


});

var authTokenCookieKey = "auth_token";

function setCookie(cname, cvalue, expirationDate) {
    var d;
    if (expirationDate && expirationDate.getMonth)
        d = expirationDate;
    else {
        d = new Date();
        d.setFullYear(d.getFullYear()+1);
    }


    var expires = "expires=" + d.toGMTString();
    console.log("HOST: " + window.location.host);
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/; domain=" + window.location.host;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}