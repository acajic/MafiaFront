angular.module('ui.dateLocale', [])
    .filter('localeDate', function () {
        return function (date) {
            if (!date)
                return '';

            return new Date(date).toLocaleString();
        };
    });