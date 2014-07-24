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

    return {
        homeButtonVisible: homeButtonVisible,
        setHomeButtonVisible: setHomeButtonVisible
    }
});