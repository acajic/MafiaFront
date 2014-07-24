Array.prototype.indexOfMatchFunction = function(func) {
    "use strict";

    for (var i in this) {
        if (!this.hasOwnProperty(i))
            continue;

        var element = this[i];

        if (func(element))
            return parseInt(i);
    }
    return -1;
};

Array.prototype.elementMatchingFunction = function(func) {
    "use strict";

    var index = this.indexOfMatchFunction(func);
    if (index < 0)
        return null;

    return this[index];
};