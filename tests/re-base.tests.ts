/// <reference path="../index.d.ts" />

import Rebase = require('re-base');

let base = Rebase.createClass({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
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

() => {
      base.delete();
      base.delete(() => { /* app has been deleted */ });
}

() => {
      let ref = base.syncState(`shoppingList`, {
            context: this,
            state: 'items',
            asArray: true,
            then: () => { }
      });
      base.removeBinding(ref)

      ref = base.bindToState('tasks', {
            context: this,
            state: 'tasks',
            asArray: true
      });
      base.removeBinding(ref)

      ref = base.listenTo('votes', {
            context: this,
            asArray: true,
            then: (votesData) => {
                  var total = 0;
                  votesData.forEach((vote, index) => {
                        total += vote
                  });
            },
            onFailure: () => { }
      })
      base.removeBinding(ref);
}

() => {
      base.fetch('sales', {
            context: this,
            asArray: true,
            then: (data) => {
                  console.log(data);
            }
      })

      base.fetch('sales', { context: this, asArray: true })
            .then(data => { console.log(data) })
            .catch(error => { /** handle error*/ })
}

() => {
      base.post(`users/123`, { data: { name: 'Tyler McGinnis', age: 25 } })
            .then(() => { })
            .catch(err => { });
}


() => {
      var immediatelyAvailableReference = base.push('bears', {
            data: { name: 'George', type: 'Grizzly' },
            then(err) {
                  console.log(err);
            }
      });
      //available immediately, you don't have to wait for the callback to be called
      var generatedKey = immediatelyAvailableReference.key;

      immediatelyAvailableReference = base.push('bears', {
            data: { name: 'George', type: 'Grizzly' }
      }).then(newLocation => {
            var generatedKey = newLocation.key;
      }).catch(err => {
            //handle error
      });
      //available immediately, you don't have to wait for the Promise to resolve
      var generatedKey = immediatelyAvailableReference.key;
}


() => {
      base.update('bears', {
            data: { name: 'George' },
            then(err) { }
      });

      // bears endpoint currently holds the object { name: 'Bill', type: 'Grizzly' }
      base.update('bears', { data: { name: 'George' } })
            .then(() => { })
            .catch(err => { });
}


() => {
      base.remove('bears', function (err) {
            if (!err) { }
      });

      base.remove('bears')
            .then(() => { })
            .catch(error => { });
}

() => {
      base.syncState('users', {
            context: this,
            state: 'users',
            asArray: true,
            queries: {
                  orderByChild: 'iq',
                  limitToLast: 3,
                  endAt: ''
            }
      });
}

() => {
      const authHandler = function (error, user) {
            if (user) {
                  console.log(user);
            }
      }

      // Simple email/password authentication
      base.authWithPassword({
            email: 'bobtony@firebase.com',
            password: 'correcthorsebatterystaple'
      }, authHandler);
}

() => {
      const authHandler = function (error, user) {
            if (user) {
                  console.log(user);
            }
      }
      //basic
      base.authWithOAuthPopup('twitter', authHandler);

      // with settings
      base.authWithOAuthPopup('github', authHandler, { scope: ['repos'] });
      base.authWithOAuthPopup('github', authHandler, { scope: 'repos' });
}

() => {
      var doSomethingWithAuthenticatedUser = function (user) {
            console.log(user);
      }

      var authHandler = function (error) {
            if (error) console.log(error);
            // noop if redirect is successful
            return;
      }

      var onRedirectBack = function (error, authData) {
            if (error) console.log(error);
            if (authData.user) {
                  doSomethingWithAuthenticatedUser(authData.user);
            } else {
                  //redirect to twitter for auth
                  base.authWithOAuthRedirect('twitter', authHandler);
            }
      }

      base.authGetOAuthRedirectResult(onRedirectBack);
}

() => {
      var doSomethingWithAuthenticatedUser = function (user) {
            console.log(user);
      }

      var doSomethingWithError = function (error) {
            console.log(error);
      }

      var authHandler = function (error, user) {
            if (error) doSomethingWithError(error);
            doSomethingWithAuthenticatedUser(user);
      }

      base.authWithCustomToken('token', authHandler);
}

() => {
      base.unauth()
}

() => {
      function authDataCallback(user) {
            if (user) {
                  console.log("User " + user.uid + " is logged in with " + user.providerId);
            } else {
                  console.log("User is logged out");
            }
      }

      // Listen to authentication
      var unsubscribe = base.onAuth(authDataCallback);

      //to remove listener
      unsubscribe();
}

() => {

      const userHandler = (user) => { }
      const errorHandler = (error) => { }
      // Create
      base.createUser({
            email: 'bobtony@firebase.com',
            password: 'correcthorsebatterystaple'
      }, userHandler);


      // Reset Password
      base.resetPassword({
            email: 'bobtony@firebase.com'
      }, errorHandler);
}