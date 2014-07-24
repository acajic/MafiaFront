/**
 * Created with JetBrains WebStorm.
 * User: Andro
 * Date: 06.07.14.
 * Time: 12:03
 * To change this template use File | Settings | File Templates.
 */

angular.module('uniqque_filter', []).filter('uniqque', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isString(filterOn)) {
                    return item[filterOn];
                } else if ( angular.isObject(item)) {
                    var valueToCompare = buildItemRecursively(item, filterOn);
                    return valueToCompare;
                } else {
                    return item;
                }
            };

            var buildItemRecursively = function(item, filterObject) {
                "use strict";
                var result = {};

                if (angular.isObject(filterObject)) {
                    for (var prop in filterObject) {
                        if (filterObject.hasOwnProperty(prop)) {
                            var value = item[prop];
                            if (value === undefined)
                                continue;

                            if (angular.isObject(value))
                                result[prop] = buildItemRecursively(value, filterObject[prop]);
                            else
                                result[prop] = value;
                        }
                    }
                } else {
                    result[filterObject] = item[filterObject];
                }
                return result;
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});