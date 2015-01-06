/**
 * Created by Andro on 23.12.2014..
 */
angular.module('ui.acHighlightText', []).filter('acHighlightText', function () {
    return function (inputString, searchText) {
        if (!inputString)
            return '';

        if (!searchText)
            return inputString;

        var index = inputString.toLowerCase().indexOf(searchText.toLowerCase());
        if (index < 0)
            return inputString;
        else {
            var prefix = inputString.substr(0, index);
            var matched = inputString.substr(index, searchText.length);
            var suffix = inputString.substring(index+searchText.length, inputString.length);

            var outputHtml = prefix + '<span class="ac-highlight-text-matched">' + matched + '</span>' + suffix;
            return outputHtml;
        }
    };
});