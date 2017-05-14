/// <reference path="../index.d.ts" />
"use strict";
var _this = this;
var Rebase = require("re-base");
var base = Rebase.createClass({
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com"
});
base = Rebase.createClass({
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxx"
});
base = Rebase.createClass({
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxx"
}, 'myApp');
(function () {
    base["delete"]();
    base["delete"](function () { });
});
(function () {
    var ref = base.syncState("shoppingList", {
        context: _this,
        state: 'items',
        asArray: true,
        then: function () { }
    });
    base.removeBinding(ref);
    ref = base.bindToState('tasks', {
        context: _this,
        state: 'tasks',
        asArray: true
    });
    base.removeBinding(ref);
    ref = base.listenTo('votes', {
        context: _this,
        asArray: true,
        then: function (votesData) {
            var total = 0;
            votesData.forEach(function (vote, index) {
                total += vote;
            });
        },
        onFailure: function () { }
    });
    base.removeBinding(ref);
});
(function () {
    base.fetch('sales', {
        context: _this,
        asArray: true,
        then: function (data) {
            console.log(data);
        }
    });
    base.fetch('sales', { context: _this, asArray: true })
        .then(function (data) { console.log(data); })["catch"](function (error) { });
});
(function () {
    base.post("users/123", { data: { name: 'Tyler McGinnis', age: 25 } })
        .then(function () { })["catch"](function (err) { });
});
(function () {
    var immediatelyAvailableReference = base.push('bears', {
        data: { name: 'George', type: 'Grizzly' },
        then: function (err) {
            console.log(err);
        }
    });
    //available immediately, you don't have to wait for the callback to be called
    var generatedKey = immediatelyAvailableReference.key;
    immediatelyAvailableReference = base.push('bears', {
        data: { name: 'George', type: 'Grizzly' }
    }).then(function (newLocation) {
        var generatedKey = newLocation.key;
    })["catch"](function (err) {
        //handle error
    });
    //available immediately, you don't have to wait for the Promise to resolve
    var generatedKey = immediatelyAvailableReference.key;
});
(function () {
    base.update('bears', {
        data: { name: 'George' },
        then: function (err) { }
    });
    // bears endpoint currently holds the object { name: 'Bill', type: 'Grizzly' }
    base.update('bears', { data: { name: 'George' } })
        .then(function () { })["catch"](function (err) { });
});
(function () {
    base.remove('bears', function (err) {
        if (!err) { }
    });
    base.remove('bears')
        .then(function () { })["catch"](function (error) { });
});
(function () {
    base.syncState('users', {
        context: _this,
        state: 'users',
        asArray: true,
        queries: {
            orderByChild: 'iq',
            limitToLast: 3,
            endAt: ''
        }
    });
});
(function () {
    var authHandler = function (error, user) {
        if (user) {
            console.log(user);
        }
    };
    // Simple email/password authentication
    base.authWithPassword({
        email: 'bobtony@firebase.com',
        password: 'correcthorsebatterystaple'
    }, authHandler);
});
(function () {
    var authHandler = function (error, user) {
        if (user) {
            console.log(user);
        }
    };
    //basic
    base.authWithOAuthPopup('twitter', authHandler);
    // with settings
    base.authWithOAuthPopup('github', authHandler, { scope: ['repos'] });
    base.authWithOAuthPopup('github', authHandler, { scope: 'repos' });
});
(function () {
    var doSomethingWithAuthenticatedUser = function (user) {
        console.log(user);
    };
    var authHandler = function (error) {
        if (error)
            console.log(error);
        // noop if redirect is successful
        return;
    };
    var onRedirectBack = function (error, authData) {
        if (error)
            console.log(error);
        if (authData.user) {
            doSomethingWithAuthenticatedUser(authData.user);
        }
        else {
            //redirect to twitter for auth
            base.authWithOAuthRedirect('twitter', authHandler);
        }
    };
    base.authGetOAuthRedirectResult(onRedirectBack);
});
(function () {
    var doSomethingWithAuthenticatedUser = function (user) {
        console.log(user);
    };
    var doSomethingWithError = function (error) {
        console.log(error);
    };
    var authHandler = function (error, user) {
        if (error)
            doSomethingWithError(error);
        doSomethingWithAuthenticatedUser(user);
    };
    base.authWithCustomToken('token', authHandler);
});
(function () {
    base.unauth();
});
(function () {
    function authDataCallback(user) {
        if (user) {
            console.log("User " + user.uid + " is logged in with " + user.providerId);
        }
        else {
            console.log("User is logged out");
        }
    }
    // Listen to authentication
    var unsubscribe = base.onAuth(authDataCallback);
    //to remove listener
    unsubscribe();
});
(function () {
    var userHandler = function (user) { };
    var errorHandler = function (error) { };
    // Create
    base.createUser({
        email: 'bobtony@firebase.com',
        password: 'correcthorsebatterystaple'
    }, userHandler);
    // Reset Password
    base.resetPassword({
        email: 'bobtony@firebase.com'
    }, errorHandler);
});
