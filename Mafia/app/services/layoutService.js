app.factory('layoutService', function() {
    "use strict";

    var homeButton = {
        visible: false
    };

    var homeButtonVisible = function() {
        return homeButton.visible;
    };

    var setHomeButtonVisible = function(visible) {
        homeButton.visible = visible;
    };

    var adminButton = {
        visible: true
    };

    var adminButtonVisible = function() {
        return adminButton.visible;
    };

    var setAdminButtonVisible = function(visible) {
        adminButton.visible = visible;
    };

    return {
        homeButtonVisible: homeButtonVisible,
        setHomeButtonVisible: setHomeButtonVisible,
        adminButtonVisible: adminButtonVisible,
        setAdminButtonVisible: setAdminButtonVisible
    }
});