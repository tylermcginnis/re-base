# re-base
[![Build Status](https://travis-ci.org/tylermcginnis/re-base.svg?branch=master)](https://travis-ci.org/tylermcginnis/re-base)
[![Coverage Status](https://coveralls.io/repos/github/tylermcginnis/re-base/badge.svg?branch=master)](https://coveralls.io/github/tylermcginnis/re-base?branch=master)

![welcome](https://media.giphy.com/media/6459ZFRF1Wxna/giphy.gif)

Questions? Find me on twitter at [@tylermcginnis33](http://twitter.com/tylermcginnis33)

# What is re-base?

React.js makes managing state easy to reason about. Firebase makes persisting your data easy to implement. re-base, inspired by Relay, combines the benefits of React and Firebase by allowing each component to specify its own data dependency. Forget about your data persistence and focus on what really matters, your application's state.

# Why re-base?

I spent a few weeks trying to figure out the cleanest way to implement Firebase into my React/Flux application. After struggling for a bit, I [tweeted](https://twitter.com/tylermcginnis33/status/605838057825132549) my frustrations. I was enlightened to the fact that Firebase and Flux really don't work well together. It makes sense why they don't work together, because they're both trying to accomplish roughly the same thing. So I did away with my reliance upon Flux and tried to think of a clean way to implement React with Firebase. I came across ReactFire built by Jacob Wenger at Firebase and loved his idea. Sync a Firebase endpoint with a property on your component's state. So whenever your data changes, your state will be updated. Simple as that. The problem with ReactFire is because it uses Mixins, it's not compatible with ES6 classes. After chatting with Jacob Turner, we wanted to create a way to allow the one way binding of ReactFire with ES6 classes along some more features like two way data binding and listening to Firebase endpoints without actually binding a state property to them. Thus, re-base was built.

# Features

- [*syncState*](#syncstateendpoint-options): Two way data binding between any property on your component's state and any endpoint in Firebase. Use the same API you're used to to update your component's state (setState), and Firebase will also update.
- [*bindToState*](#bindtostateendpoint-options): One way data binding. Whenever your Firebase endpoint changes, the property on your state will update as well.
- [*listenTo*](#listentoendpoint-options): Whenever your Firebase endpoint changes, it will invoke a callback passing it the new data from Firebase.
- [*fetch*](#fetchendpoint-options): Retrieve data from Firebase without setting up any binding or listeners.
- [*post*](#postendpoint-options): Add new data to Firebase.
- [*push*](#pushendpoint-options): Push new child data to Firebase.
- [*update*](#updateendpoint-options): Update child data using only the referenced properties
- [*removeBinding*](#removebindingref): Remove all of the Firebase listeners when your component unmounts.
- [*reset*](#reset): Removes all of the Firebase listeners and resets the singleton (for testing purposes).

# Installing

```bash
$ npm install re-base
```

# API

#### For more in depth examples of the API, see the [`examples`](examples) folder.

## createClass(firebaseConfig, name)

##### Purpose
Accepts a firebase configuration object as the first parameter and an optional 'name' for the app

##### Arguments
  1. configuration
    - type: object
    - properties:
      - apiKey (string - required) your firebase API key
      - authDomain (string - required) your firebase auth domain
      - databaseURL (string - required) your firebase database root URL
      - storageBucket (string - optional) your firebase storage bucket
  2. app name
    - type: string (optional, defaults to '[DEFAULT]')

##### Return Value
  An instance of re-base.

##### Example

```javascript
var Rebase = require('re-base');
var base = Rebase.createClass({
  	  apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
}, 'myApp');
```

<br />

## syncState(endpoint, options)

##### Purpose
  Allows you to set up two way data binding between your component's state and your Firebase. Whenever your Firebase changes, your component's state will change. Whenever your component's state changes, Firebase will change.

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint to which you'd like to bind your component's state
  2. options
    - type: object
    - properties:
      - context: (object - required) The context of your component
      - state: (string - required) The state property you want to sync with Firebase
      - asArray: (boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - queries: (object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.
      - then: (function - optional) The callback function that will be invoked when the initial listener is established with Firebase. Typically used (with syncState) to change `this.state.loading` to false.

#### Return Value
  An object which you can pass to `removeBinding` when your component unmounts to remove the Firebase listeners.

#### Example

```javascript
componentDidMount(){
  base.syncState(`shoppingList`, {
    context: this,
    state: 'items',
    asArray: true
  });
}
addItem(newItem){
  this.setState({
    items: this.state.items.concat([newItem]) //updates Firebase and the local state
  });
}
```

<br />

## bindToState(endpoint, options)

#### Purpose
  One way data binding from Firebase to your component's state. Allows you to bind a component's state property to a Firebase endpoint so whenever that Firebase endpoint changes, your component's state will be updated with that change.

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint that you'd like your component's state property to listen for changes
  2. options
    - type: object
    - properties:
      - context: (object - required) The context of your component
      - state: (string - required) The state property you want to sync with Firebase
      - asArray: (boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - queries: (object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.
      - then: (function - optional) The callback function that will be invoked when the initial listener is established with Firebase. Typically used (with bindToState) to change `this.state.loading` to false.

#### Return Value
  An object which you can pass to `removeBinding` when your component unmounts to remove the Firebase listeners.

#### Example

```javascript
componentDidMount(){
  base.bindToState('tasks', {
    context: this,
    state: 'tasks',
    asArray: true
  });
}
```

<br />

## listenTo(endpoint, options)

#### Purpose
  Allows you to listen to Firebase endpoints without binding those changes to a state property. Instead, a callback will be invoked with the newly updated data.

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint which contains the data with which you'd like to invoke your callback function
  2. options
    - type: object
    - properties:
      - context: (object - required) The context of your component
      - asArray: (boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - then: (function - required) The callback function that will be invoked with the data from the specified endpoint when the endpoint changes
      - queries: (object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.

#### Return Value
  An object which you can pass to `removeBinding` when your component unmounts to remove the Firebase listeners.

#### Example

```javascript
componentDidMount(){
  base.listenTo('votes', {
    context: this,
    asArray: true,
    then(votesData){
      var total = 0;
      votesData.forEach((vote, index) => {
        total += vote
      });
      this.setState({total});
    }
  })
}
```

<br />

## fetch(endpoint, options)

#### Purpose
  Allows you to retrieve the data from a Firebase endpoint just once without subscribing or listening for data changes.

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint which contains the data you're wanting to fetch
  2. options
    - type: object
    - properties:
      - context: (object - required) The context of your component
      - asArray: (boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - then: (function - required) The callback function that will be invoked with the data from the specified endpoint when the endpoint changes
      - onFailure: (function - optional) The callback function that will be invoked with an error that occurs reading data from the specified endpoint
      - queries: (object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.

#### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

#### Example

*Using callback*

```javascript
getSales(){
  base.fetch('sales', {
    context: this,
    asArray: true,
    then(data){
      console.log(data);
    }
  });
}
```

*Using Promise*

```javascript
getSales(){
  base.fetch('sales', {
    context: this,
    asArray: true
  }).then(data => {
    console.log(data);
  }).catch(error => {
    //handle error
  })
}
```

<br />

## post(endpoint, options)

#### Purpose
  Allows you to update a Firebase endpoint with new data. *Replace all the data at this endpoint with the new data*

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint that you'd like to update with the new data
  2. options
    - type: object
    - properties:
      - data: (any - required) The data you're wanting to persist to Firebase
      - then: (function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

#### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

#### Example

*Using callback*

```javascript
addUser(){
  base.post(`users/${userId}`, {
    data: {name: 'Tyler McGinnis', age: 25},
    then(err){
      if(!err){
        Router.transitionTo('dashboard');
      }
    }
  });
}
```

*Using promise*

```javascript
addUser(){
  base.post(`users/${userId}`, {
    data: {name: 'Tyler McGinnis', age: 25}
  }).then(() => {
    Router.transitionTo('dashboard');
  }).catch(err => {
    // handle error
  });
}
```

<br />

## push(endpoint, options)

#### Purpose
  Allows you to add data to a Firebase endpoint. *Adds data to a child of the endpoint with a new Firebase push key*

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint that you'd like to push the new data to
  2. options
    - type: object
    - properties:
      - data: (any - required) The data you're wanting to persist to Firebase
      - then: (function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

#### Return Value
  A Firebase [ThenableReference](https://firebase.google.com/docs/reference/js/firebase.database.ThenableReference)
  which is defined by Firebase as a "Combined Promise and reference; resolves when write is complete, but can be used immediately as the reference to the child location."

#### Example

*Using callback*

```javascript
//
addBear(){
  var immediatelyAvailableReference = base.push('bears', {
    data: {name: 'George', type: 'Grizzly'},
    then(err){
      if(!err){
        Router.transitionTo('dashboard');
      }
    }
  });
  //available immediately, you don't have to wait for the callback to be called
  var generatedKey = immediatelyAvailableReference.key;
}
```

*Using Promise interface*

```javascript
//
addBear(){
  var immediatelyAvailableReference = base.push('bears', {
    data: {name: 'George', type: 'Grizzly'}
  }).then(newLocation => {
    var generatedKey = newLocation.key;
  }).catch(err => {
    //handle error
  });
  //available immediately, you don't have to wait for the Promise to resolve
  var generatedKey = immediatelyAvailableReference.key;
}

```

<br />

## update(endpoint, options)

#### Purpose
  Allows you to update data at a Firebase endpoint changing only the properties you pass to it.
  **Warning: calling update with `options.data` being null will remove the all the data at that endpoint**

#### Arguments
  1. endpoint
    - type: string
    - The relative Firebase endpoint that you'd like to update
  2. options
    - type: object
    - properties:
      - data: (any - required) The data you're wanting to persist to Firebase
      - then: (function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

#### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

#### Example

*Using callback*

```javascript
  // bears endpoint currently holds the object { name: 'Bill', type: 'Grizzly' }
  base.update('bears', {
    data: {name: 'George'},
    then(err){
      if(!err){
        Router.transitionTo('dashboard');
        //bears endpint is now {name: 'George', type: 'Grizzly'}
      }
    }
  });

```

*Using Promise*

```javascript
  // bears endpoint currently holds the object { name: 'Bill', type: 'Grizzly' }
  base.update('bears', {
    data: {name: 'George'}
  }).then(() => {
    Router.transitionTo('dashboard');
  }).catch(err => {
    //handle error
  });
```

<br />

## removeBinding(ref)

#### Purpose
  Remove the listeners to Firebase when your component unmounts.

#### Arguments
  1. ref
    - type: Object
    - The return value of syncState, bindToState, or listenTo

#### Return Value
  No return value

#### Example

```javascript
componentDidMount(){
  this.ref = base.syncState('users', {
    context: this,
    state: 'users'
  });
}
componentWillUnmount(){
  base.removeBinding(this.ref);
}
```

<br />

## reset()

#### Purpose
  Removes every Firebase listener and resets all private variables. Used for testing purposes.

#### Arguments
  No Arguments

#### Return Value
  No return value

<br />

## <a name='queries'>Queries</a>

Use the query option to utilize the [Firebase Query](https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries) API.  For a list of available queries and how they work, see the Firebase docs.

Queries are accepted in the `options` object of each read method (`syncState`, `bindToState`, `listenTo`, and `fetch`).  The object should have one or more keys of the type of query you wish to run, with the value being the value for the query.  For example:

```javascript
base.syncState('users', {
  context: this,
  state: 'users',
  asArray: true,
  queries: {
    orderByChild: 'iq',
    limitToLast: 3
  }
})
```

The binding above will sort the `users` endpoint by iq, retrieve the last three (or, three with highest iq), and bind it to the component's `users` state.  NOTE: This query is happening within Firebase.  The *only* data that will be retrieved are the three users with the highest iq.

## <a name='auth'>Authentication</a>

re-base exposes a few methods of [the Firebase Auth service](https://firebase.google.com/docs/reference/js/firebase.auth.Auth) to help with user authentication.

## authWithPassword(auth, authHandler)

#### Purpose
  Authenticate a user by email and password.

  **_the Email sign-in method needs to be enabled in your firebase console_**

#### Arguments
  1. authentication object
    - type: Object
    - properties:
    	- email (string - required)
    	- password (string - required)
  2. auth handler
  	- type: function
  		- arguments:
  			- error (object or null)
  			- user data (object)

#### Return Value
  No return value

#### Example

```javascript
var authHandler = function(error, user) {
  if(error) doSomethingWithError(error);
  doSomethingWithUser(user);
}

// Simple email/password authentication
base.authWithPassword({
  email    : 'bobtony@firebase.com',
  password : 'correcthorsebatterystaple'
}, authHandler);

```
<br />

## authWithOAuthPopup(provider, handler, settings)

#### Purpose
  Authenticate a user using an OAuth popup

  **_the sign in provider you are using needs to be enabled in your firebase console_**

#### Arguments
  1. provider
    - type: string
    - name of auth provider "facebook, twitter, github, google"
  2. auth handler
  	- type: function
  		- arguments:
  			- error (object or null)
  			- user data (object)
  3. settings (available settings vary per auth provider)
  	- type: object (optional)
  		- properties:
  			- scope (array or string)

#### Return Value
  No return value

#### Example

```javascript
var authHandler = function(error, user) {
  if(error) doSomethingWithError(error);
  doSomethingWithUser(user);
}
//basic
base.authWithOAuthPopup('twitter', authHandler);

// with settings
base.authWithOAuthPopup('github', authHandler, {scope: ['repos']});

```
<br />

## authWithOAuthRedirect(provider, handler, settings)

#### Purpose
  Authenticate a user using an OAuth redirect

  **_the sign in provider you are using needs to be enabled in your firebase console_**

#### Arguments
  1. provider
    - type: string
    - name of auth provider "facebook, twitter, github, google"
  2. auth handler
  	- type: function
  		- arguments:
  			- error (object or null)
  3. settings (available settings vary per auth provider)
  	- type: object (optional)
  		- properties:
  			- scope (array or string)

#### Return Value
  No return value

#### Example

```javascript
var authHandler = function(error) {
  if(error) doSomethingWithError(error);
  // noop if redirect is successful
  return;
}
//basic
base.authWithOAuthRedirect('twitter', authHandler);

// with settings
base.authWithOAuthRedirect('github', authHandler, {scope: ['repos']});

```
<br />

## authGetOAuthRedirectResult(handler)

#### Purpose
 Completes the OAuth redirect flow initiated by `authWithOAuthRedirect`

#### Arguments

  1. handler
  	- type: function
  		- arguments:
  			- error (object or null)
  			- user data (object)

#### Return Value
  No return value

#### <a name='redirect-example'>Example</a>

```javascript
var authHandler = function(error) {
  if(error) console.log(error);
  // noop if redirect is successful
  return;
}

var onRedirectBack = function(error, authData){
  if(error) console.log(error);
  if(authData.user){
    doSomethingWithAuthenticatedUser(authData.user);
  } else {
    //redirect to twitter for auth
    base.authWithOAuthRedirect('twitter', authHandler);
  }
}

base.authGetOAuthRedirectResult(onRedirectBack);


```
<br />

## authWithOAuthToken(provider, token, handler, settings)

#### Purpose
 Authenticate with OAuth provider using a token

#### Arguments

  1. provider
    - type: string
    - name of auth provider "facebook, twitter, github, google"
  2. token
    - type: string
  3. handler
  	- type: function
  		- arguments:
  			- error (object or null)
  			- user data (object)
  4. settings (available settings vary per auth provider)
  	- type: object (optional)
  		- properties:
  			- scope (array or string)
  			- providerOptions (object)
  				- properties:
  					- secret (twitter only - optional)
  					- idToken(google only - optional, must be null if using accessToken)
  					- accessToken(google only - optional)

#### Return Value
  No return value

#### Example

```javascript
var authHandler = function(error, user) {
  if(error) doSomethingWithError(error);
  doSomethingWithAuthenticatedUser(user);
}

// optional settings for auth provider
var settings = { scope: ['repos'] };

base.authWithOAuthToken('twitter', <yourtoken>, authHandler, settings);

```
<br />

## authWithCustomToken(token,handler)

#### Purpose
 Authenticate OAuth redirect flow initiated by `authWithOAuthRedirect`

#### Arguments

  1. token
    - type: string
  2. auth handler
  	- type: function
  		- arguments:
  			- error (object or null)
  			- user data (object)

#### Return Value
  No return value

#### Example

```javascript
var authHandler = function(error, user) {
  if(error) doSomethingWithError(error);
  doSomethingWithAuthenticatedUser(user);
}

base.authWithCustomToken(<yourtoken>, authHandler);


```
<br />

## unauth()

#### Purpose
 Signs out the currently logged in user

#### Arguments

none

#### Return Value
  No return value

#### Example

```javascript

base.unauth()

```

<br />

## onAuth(handler)

#### Purpose
 Listen to the authentication event

#### Arguments

  1. handler
  	- type: function
  		- arguments:
  			- user data (object or null) null if user is not logged in

#### Return Value
  an unsubscribe function for the added listener
#### Example

```javascript

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

```



## <a name='users'>User Management</a>

re-base exposes a few helper methods for user methods for user management.


```javascript
// Create
base.createUser({
  email: 'bobtony@firebase.com',
  password: 'correcthorsebatterystaple'
}, userHandler);


// Reset Password
base.resetPassword({
  email: 'bobtony@firebase.com'
}, errorHandler);

```

## <a name='firebase-services'>Firebase Services</a>

re-base also exposes the firebase services for the current app

Firebase App [Docs](https://firebase.google.com/docs/reference/js/firebase.app.App)

`base.app`

Firebase Database [Docs](https://firebase.google.com/docs/reference/js/firebase.app.App#database)

`base.database`

Firebase Storage [Docs](https://firebase.google.com/docs/reference/js/firebase.app.App#storage)

`base.storage`

Firebase Auth [Docs](https://firebase.google.com/docs/reference/js/firebase.app.App#auth)

`base.auth`

## <a name='upgrading'>Upgrading to re-base 2.x from 1.x</a>

First follow the upgrade guide at [https://firebase.google.com/support/guides/firebase-web](https://firebase.google.com/support/guides/firebase-web)

Change your re-base initialization to use the new firebase configuration.

**Change** this....
```javascript

var Rebase = require('re-base');
var base = Rebase.createClass('https://myapp.firebaseio.com');

```

***To*** this...
```javascript

var Rebase = require('re-base');
var base = Rebase.createClass({
  	  apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
});

```

### Changes to Database methods
<hr />


No changes. Your existing code should work.

<br />

### Changes to Authentication methods
<hr />


***Deprecated Methods***

`base.offAuth`

`base.onAuth` now returns an unsubscribe function that removes the listener.

***Behavior Changes***

`base.authWithOAuthRedirect`

The redirect flow needs to be completed with an added `base.authGetOAuthRedirectResult` method. See [example](#redirect-example).

<br />
### Changes to User Management
<hr />

***Deprecated Methods***

`base.removeUser` - users can only remove themselves. See [firebase documentation.](https://firebase.google.com/docs/reference/js/firebase.User#delete)
`base.changePassword` users can only change their own passwords. See [firebase documentation.](https://firebase.google.com/docs/reference/js/firebase.User#updatePassword)

***Behavior Changes***

`base.createUser` - This method will now log you in as the newly created user on success. See [firebase documentation.](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword)

## Contributing

1. `npm install`
2. Edit `src/rebase.js`
3. Add/edit tests in `tests/specs/re-base.spec.js`
4. `npm run build`
5. `npm run test`

## Credits

re-base is inspired by ReactFire from Firebase. Jacob Turner is also a core contributor and this wouldn't have been possible without his assistance.

## License

MIT
