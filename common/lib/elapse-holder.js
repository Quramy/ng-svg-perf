"use strict";
var ElapseHolder = (function () {
    function ElapseHolder(ignoreCount) {
        if (ignoreCount === void 0) { ignoreCount = 10; }
        this.ignoreCount = ignoreCount;
        this._elapses = [];
    }
    ElapseHolder.prototype.reset = function () {
        this._elapses = [];
    };
    ElapseHolder.prototype.start = function () {
        this._referenceValue = Date.now();
        return this;
    };
    ElapseHolder.prototype.end = function () {
        if (!this._referenceValue)
            return this;
        var elapse = Date.now() - this._referenceValue;
        this._elapses.push(elapse);
        return this;
    };
    ElapseHolder.prototype.average = function () {
        var _this = this;
        if (this._elapses.length < this.ignoreCount)
            return NaN;
        return this._elapses
            .filter(function (e, i) { return i >= _this.ignoreCount; })
            .reduce(function (s, e) {
            return s + e;
        }, 0) / (this._elapses.length - this.ignoreCount);
    };
    return ElapseHolder;
}());
exports.ElapseHolder = ElapseHolder;
