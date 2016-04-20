"use strict";
var User = (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var Follow = (function () {
    function Follow() {
    }
    return Follow;
}());
exports.Follow = Follow;
var Link = (function () {
    function Link() {
    }
    return Link;
}());
exports.Link = Link;
var UserLink = (function () {
    function UserLink() {
        this._rawUsers = [];
        this._rawFollows = [];
        this._users = [];
        this._follows = [];
        this.init().pickup();
    }
    UserLink.prototype.update = function (users, links) {
        this._users = users;
        this._follows = links;
    };
    UserLink.prototype.nodes = function () {
        return this._users.slice();
    };
    UserLink.prototype.links = function () {
        var _this = this;
        var follows = this._follows.slice();
        return follows.map(function (f) {
            var link = {
                source: _this._users.findIndex(function (u) { return u.id === f.source; }),
                target: _this._users.findIndex(function (u) { return u.id === f.target; })
            };
            return link;
        }).filter(function (link) {
            return link.source !== -1 && link.target !== -1;
        });
    };
    UserLink.prototype.init = function () {
        var rawUsers = require('../data/_users.json');
        var users = rawUsers.map(function (u) {
            return {
                id: u.id.toLowerCase(),
                raw: u
            };
        });
        var links = require('../data/_links.json');
        this._rawUsers = users;
        this._rawFollows = links;
        return this;
    };
    UserLink.prototype.pickup = function (options) {
        var minItems = options && options.minItems || 10;
        var linkDiv = options && options.linkDiv || 1;
        var users = this._rawUsers.filter(function (u) {
            return u.raw.items_count >= minItems;
        });
        var follows = this._rawFollows
            .filter(function (l) {
            return users.some(function (u) { return u.id === l.source; }) && users.some(function (u) { return u.id === l.target; });
        })
            .filter(function (l, i) { return !(i % linkDiv); });
        users = users.filter(function (u) {
            return follows.some(function (l) { return l.source === u.id; }) || follows.some(function (l) { return l.target === u.id; });
        });
        this._users = users;
        this._follows = follows;
        return this;
    };
    return UserLink;
}());
exports.UserLink = UserLink;
