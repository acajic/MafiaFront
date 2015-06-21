app.factory('navigationService', function() {
    "use strict";

    var infoPaths = ['welcome', 'about', 'roles', 'advanced'];

    var home = {
        selectedTabIndex: 1,
        paths: {
            0 : infoPaths[0],
            1 : 'my',
            2 : 'all'
        },
        infoPaths : infoPaths,
        selectedInfoIndex : 0
    };

    var getHomePath = function () {
        switch (home.selectedTabIndex) {
            case 0:
                return '/' + home.infoPaths[home.selectedInfoIndex];
            case 2:
                return '/' + home.paths[2];
            default:
                return '/' + home.paths[1];
        }
    };

    return {
        home : home,
        getHomePath : getHomePath
    }
});