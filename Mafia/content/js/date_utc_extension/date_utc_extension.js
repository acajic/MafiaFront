Date.prototype.utc = function(func) {
    "use strict";


    return new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(),  this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
};