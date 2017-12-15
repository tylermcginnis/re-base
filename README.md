# re-base
[![Build Status](https://travis-ci.org/tylermcginnis/re-base.svg?branch=master)](https://travis-ci.org/tylermcginnis/re-base)
[![Coverage Status](https://coveralls.io/repos/github/tylermcginnis/re-base/badge.svg?branch=master)](https://coveralls.io/github/tylermcginnis/re-base?branch=master)

![welcome](https://media.giphy.com/media/6459ZFRF1Wxna/giphy.gif)

Questions? Find me on twitter at [@tylermcginnis](http://twitter.com/tylermcginnis)

# What is re-base?

React.js makes managing state easy to reason about. Firebase makes persisting your data easy to implement. re-base, inspired by Relay, combines the benefits of React and Firebase by allowing each component to specify its own data dependency. Forget about your data persistence and focus on what really matters, your application's state.

# Why re-base?

I spent a few weeks trying to figure out the cleanest way to implement Firebase into my React/Flux application. After struggling for a bit, I [tweeted](https://twitter.com/tylermcginnis33/status/605838057825132549) my frustrations. I was enlightened to the fact that Firebase and Flux really don't work well together. It makes sense why they don't work together, because they're both trying to accomplish roughly the same thing. So I did away with my reliance upon Flux and tried to think of a clean way to implement React with Firebase. I came across ReactFire built by Jacob Wenger at Firebase and loved his idea. Sync a Firebase endpoint with a property on your component's state. So whenever your data changes, your state will be updated. Simple as that. The problem with ReactFire is because it uses Mixins, it's not compatible with ES6 classes. After chatting with Jacob Turner, we wanted to create a way to allow the one way binding of ReactFire with ES6 classes along some more features like two way data binding and listening to Firebase endpoints without actually binding a state property to them. Thus, re-base was built.


# Installing

```bash
$ npm install --save re-base
```

# Examples

For more in depth examples, see the [`examples`](examples) folder.


# API

## Firebase Real Time Database

### Overview

- [*syncState*](#syncstateendpoint-options): Two way data binding between any property on your component's state and any endpoint in Firebase. Use the same API you're used to to update your component's state (setState), and Firebase will also update.
- [*bindToState*](#bindtostateendpoint-options): One way data binding. When your Firebase endpoint changes, the property on your state will update as well.
- [*listenTo*](#listentoendpoint-options): When your Firebase endpoint changes, it will invoke a callback passing it the new data from Firebase.
- [*fetch*](#fetchendpoint-options): Retrieve data from Firebase without setting up any binding or listeners.
- [*post*](#postendpoint-options): Add new data to Firebase.
- [*push*](#pushendpoint-options): Push new child data to Firebase.
- [*update*](#updateendpoint-options): Update child data using only the referenced properties
- [*remove*](#removeendpoint-callback): Remove data from Firebase
- [*removeBinding*](#removebindingref): Remove a Firebase listener before the component unmounts if you need to. (Listeners are automatically cleaned up when component unmounts)
- [*reset*](#reset): Removes all of the Firebase listeners.

### createClass(firebaseDatabase)

##### Purpose
Accepts an initialized firebase database object

##### Arguments
  1. initialized firebase database (Object)

##### Return Value
  An instance of re-base.

##### Example using all of firebase

```javascript
var Rebase = require('re-base');
var firebase = require('firebase');
var app = firebase.initializeApp({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
      messagingSenderId: "xxxxxxxxxxxxxx"
});
var base = Rebase.createClass(app.database());

```

##### Example using only the firebase database component

```javascript
var Rebase = require('re-base');
var firebase = require('firebase/app');
var database = require('firebase/database');
var app = firebase.initializeApp({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
      messagingSenderId: "xxxxxxxxxxxxxx"
});
var db = firebase.database(app);
var base = Rebase.createClass(db);

```

<br />

### initializedApp

##### Purpose
  This property contains the initialized firebase app that was passed into re-base. You can access any of the firebase services that you are using off this object. For instance, if you want to use some firebase `database` methods that re-base doesn't have helpers for or if you are using the `auth` service and want to quickly access it off of re-base.

<br />

### timestamp

##### Purpose
  This property contains an object that you can use when adding data that will be converted to a timestamp by Firebase. See [the docs](https://firebase.google.com/docs/reference/js/firebase.database.ServerValue) for more info.

<br />

### syncState(endpoint, options)

##### Purpose
  Allows you to set up two way data binding between your component's state and your Firebase. Whenever your Firebase changes, your component's state will change. Whenever your component's state changes, Firebase will change.

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint to which you'd like to bind your component's state
  2. options (Object)
      - context: (Object - required) The context of your component
      - state: (String - required) The state property you want to sync with Firebase; can be an arbitrarily nested property a là `foo.bar`
      - defaultValue: (String|Boolean|Number|Object - optional) A default value to set when the Firebase endpoint has no value (i.e., on init) (use this if you want a value other than an empty object or empty array)
      - asArray: (Boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - keepKeys: (Boolean - optional) will keep any firebase generated keys intact when manipulating data using the asArray option.
      - queries: (Object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.
      - then: (Function - optional) The callback function that will be invoked when the initial listener is established with Firebase. Typically used (with syncState) to change `this.state.loading` to false.
      - onFailure: (Function - optional) A callback function that will be invoked if the current user does not have read  or write permissions at the location.

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

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

### bindToState(endpoint, options)

##### Purpose
  One way data binding from Firebase to your component's state. Allows you to bind a component's state property to a Firebase endpoint so whenever that Firebase endpoint changes, your component's state will be updated with that change.

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint that you'd like to bind to your component's state
  2. options (Object)
      - context: (Object - required) The context of your component
      - state: (String - required) The state property you want to sync with Firebase; can be an arbitrarily nested property a là `foo.bar` (no arrays)
      - asArray: (Boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - queries: (Object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.
      - then: (Function - optional) The callback function that will be invoked when the initial listener is established with Firebase. Typically used (with bindToState) to change `this.state.loading` to false.
      - onFailure: (Function - optional) A callback function that will be invoked if the current user does not have read permissions at the location.

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

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

### listenTo(endpoint, options)

##### Purpose
  Allows you to listen to Firebase endpoints without binding those changes to a state property. Instead, a callback will be invoked with the newly updated data.

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint which contains the data with which you'd like to invoke your callback function
  2. options (Object)
      - context: (Object - required) The context of your component
      - asArray: (Boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - then: (Function - required) The callback function that will be invoked with the data from the specified endpoint when the endpoint changes
      - onFailure: (Function - optional) The callback function that will be invoked if the current user does not have read permissions at the location.
      - queries: (Object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.

##### Return Value
  An object which you can pass to `removeBinding` when your component unmounts to remove the Firebase listeners.

##### Example

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

### fetch(endpoint, options)

##### Purpose
  Allows you to retrieve the data from a Firebase endpoint just once without subscribing or listening for data changes.

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint which contains the data you're wanting to fetch
  2. options (Object)
      - context: (Object - optional) The context of your component
      - asArray: (Boolean - optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
      - then: (Function - optional) The callback function that will be invoked with the data from the specified endpoint when the endpoint changes
      - onFailure: (Function - optional) The callback function that will be invoked with an error that occurs reading data from the specified endpoint
      - queries: (Object - optional) Queries to be used with your read operations.  See [Query Options](#queries) for more details.

##### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

##### Example

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

### post(endpoint, options)

##### Purpose
  Allows you to update a Firebase endpoint with new data. *Replace all the data at this endpoint with the new data*

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint that you'd like to update with the new data
  2. options (Object)
      - data: (Any - required) The data you're wanting to persist to Firebase
      - then: (Function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

##### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

##### Example

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

### push(endpoint, options)

##### Purpose
  Allows you to add data to a Firebase endpoint. *Adds data to a child of the endpoint with a new Firebase push key*

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint that you'd like to push the new data to
  2. options (Object)
      - data: (Any - required) The data you're wanting to persist to Firebase
      - then: (Function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

##### Return Value
  A Firebase [ThenableReference](https://firebase.google.com/docs/reference/js/firebase.database.ThenableReference)
  which is defined by Firebase as a "Combined Promise and reference; resolves when write is complete, but can be used immediately as the reference to the child location."

##### Example

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

### update(endpoint, options)

##### Purpose
  Allows you to update data at a Firebase endpoint changing only the properties you pass to it.
  **Warning: calling update with `options.data` being null will remove all the data at that endpoint**

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint that you'd like to update
  2. options (Object)
      - data: (Any - required) The data you're wanting to persist to Firebase
      - then: (Function - optional) A callback that will get invoked once the new data has been saved to Firebase. If there is an error, it will be the only argument to this function.

##### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the write is complete and rejects if there is an error

##### Example

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

### remove(endpoint, callback)

##### Purpose
  Allows you to delete all data at the endpoint location

##### Arguments
  1. endpoint (String)
      - The relative Firebase endpoint that you'd like to delete data from
  2. callback (Function - optional)
      - A callback that will get invoked once the data is successfully removed Firebase. If there is an error, it will be the only argument to this function.

##### Return Value
  A Firebase [Promise](https://firebase.google.com/docs/reference/js/firebase.Promise) which resolves when the deletion is complete and rejects if there is an error

##### Example

*Using callback*

```javascript

  base.remove('bears', function(err){
    if(!err){
      Router.transitionTo('dashboard');
    }
  });

```

*Using Promise*

```javascript
  base.remove('bears').then(() => {
    Router.transitionTo('dashboard');
  }).catch(error => {
    //handle error
  });

```

<br />

### removeBinding(ref)

##### Purpose
Clean up a listener. Listeners are automatically cleaned up when components unmount, however if you wish to remove a listener while the component is still mounted this will allow you to do that. An example would be if you want to start listening to a new endpoint in response to a prop change.

##### Arguments
  1. ref (Object)
      - The return value of `syncState`, `bindToState`, or `listenTo`

##### Return Value
  No return value

##### Example

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

### reset()

##### Purpose
  Removes every Firebase listener and resets all private variables.

##### Arguments
  No Arguments

##### Return Value
  No return value

<br />

### <a name='queries'>Using Firebase Queries</a>

Use the query option to utilize the [Firebase Query](https://firebase.google.com/docs/reference/js/firebase.database.Query) API.  For a list of available queries and how they work, see the Firebase docs.

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


## Firestore

### Overview

- [*createClass*](#createclassfirestoredatebase) : Initialize the re-base instance
- [*bindDoc*](#binddocreforpath-options) : One way data binding. When your Document changes, your component will update with the new data.
- [*listenToDoc*](#listentodocreforpath-options) : One way data binding. When your Document changes, it will invoke a callback passing it the new data.
- [*bindCollection*](#bindcollectionreforpath-options) : One way binding. When the collection changes, your component will update with the new data.
- [*listenToCollection*](#listentocollectionreforpath-options): One way binding. When the collection changes, it will invoke a callback passing it the new data.
- [*get*](#getreforpath-options) : One way binding. When the collection changes, it will invoke a callback passing it the new data.
- [*addToCollection*](#addtocollectionreforpath-data-id) : Add a new document to a collection.
- [*updateDoc*](#updatedocreforpath-data) : Add a new document to a collection.
- [*removeDoc*](#removedocreforpath) : Deletes a document.
- [*removeFromCollection*](#removefromcollectionreforpath-options) : Deletes documents from a collection.
- [*syncDoc*](#syncdocreforpath-options) : Syncs a components local state with a document (Read and Write)
- [*removeBinding*](#fs-remove-binding): Remove a Firebase listener before the component unmounts if you need to. (Listeners are automatically cleaned up when component unmounts)
- [*reset*](#fs-reset): Removes all Firestore listeners.


### createClass(firestoreDatabase)

##### Purpose
Accepts an initialized firebase database object

##### Arguments
  1. initialized firestore database (Object)

##### Return Value
  An instance of re-base (with the Firestore methods available)

##### Example using all of firebase

```javascript
var Rebase = require('re-base');
var firebase = require('firebase');
require('firebase/firestore');
var app = firebase.initializeApp({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
      messagingSenderId: "xxxxxxxxxxxxxx"
});
var base = Rebase.createClass(app.firestore());

```

##### Example using only the firestore component

```javascript
var Rebase = require('re-base');
var firebase = require('firebase/app');
require('firebase/firestore');
var app = firebase.initializeApp({
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxx"
});
var db = firebase.firestore(app);
var base = Rebase.createClass(db);
```

### initializedApp

##### Purpose
  This property contains the initialized firebase app that was passed into re-base. You can access any of the firebase services that you are using off this object. For instance, if you are using the `auth` service and want to quickly access it off of re-base

<br />

### timestamp

##### Purpose
  This property contains the an object that you can use when adding data that will be converted to a timestamp by Firestore. See [the docs](https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue#.serverTimestamp) for more info.

<br />


## Reading Data

### bindDoc(refOrPath, options)

##### Purpose
Bind a document to your component. When then document changes in firestore, your component will re-render with the latest data.

##### Arguments
  - DocumentReference or path (DocumentReference or String)
  - options (Object)
    - context: (Object - required) your react component
    - state: (String - optional) a property name on your state to bind your document to, if omitted the document will be merged into your existing state
    - then: (Function - optional) a callback that will be called when the listener is set, use for loading indicators
    - onFailure: (Function - optional) a callback that will be called with any errors such as permissions errors

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

```javascript
componentWillMount() {
  base.bindDoc('myCollection/myDocument', {
    context: this,
    then() {
      this.setState({
        loading: false
      })
    },
    onFailure(err) {
      //handle error
    }
  });
}
```

### listenToDoc(refOrPath, options)

##### Purpose

Listen to a document, when the data changes it will invoke a callback passing it the new data from Firestore.

##### Arguments
  1. DocumentReference or path (DocumentReference or String)
  2. options (Object)
      - context: (Object - required) your react component
      - then: (Function - required) a callback that will be called with the data from Firestore
      - onFailure: (Function - optional) a callback that will be called with any errors such as permissions errors

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

```javascript
componentWillMount() {
  base.listenToDoc('myCollection/myDocument', {
    context: this,
    then(data) {
      //do something with the data
    },
    onFailure(err) {
      //handle error
    }
  });
}
```

### bindCollection(refOrPath, options)

##### Purpose

Bind a collection to a state property in your component.  When then collection changes in firestore, your component will re-render with the latest data.

##### Arguments
  1. CollectionReference or path (DocumentReference or String)
  2. options (Object)
      - context : (Object - required) your react component
      - state : (String - required) the state property to bind the collection to.
      - query : (Function - optional) a function that receives the created ref as its only argument. You can chain any Firestore queries you want to perform. See [Using Firestore Queries](#firestorequeries)
      - withIds : (Boolean - optional) will embed firestore generated document ids inside each document in your collections on the `id` property.
      - withRefs : (Boolean - optional) will embed the DocumentReference inside each document in your collection on the `ref` property.
      - then : (Function - optional) a callback that will be called when the listener is set, use for loading indicators
      - onFailure : (Function - optional) a callback that will be called with any errors such as permissions errors

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

```javascript
componentWillMount() {
  base.bindCollection('myCollection', {
    context: this,
    state: 'users',
    withRefs: true,
    withIds: true,
    query: (ref) => ref.where('type', '==', 'subscriber'),
    then(data) {
     this.setState(state => ({
       ...state,
       loading: false
     }))
    },
    onFailure(err) {
      //handle error
    }
  });
}
```

### listenToCollection(refOrPath, options)

##### Purpose

Listen to a collection, when the data changes it will invoke a callback passing it the new data from Firestore.


##### Arguments
  1. CollectionReference or path (CollectionReference or String)
  2. options (Object)
      - context : (Object - required) your react component
      - then : (Function - required) a callback that will be called with the data
      - query : (Function - optional) a function that receives the created ref as its only argument. You can chain any Firestore queries you want to perform. See [Using Firestore Queries](#firestorequeries)
      - withIds : (Boolean - optional) will embed firestore generated document ids inside each document in your collections on the `id` property.
      - withRefs : (Boolean - optional) will embed the DocumentReference inside each document in your collection on the `ref` property.
      - onFailure : (Function - optional) a callback that will be called with any errors such as permissions errors

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

```javascript
componentWillMount() {
  base.listenToCollection('myCollection', {
    context: this,
    query: (ref) => ref.where('type', '==', 'subscriber'),
    then(data) {
     // do something with the data
    },
    onFailure(err) {
      //handle error
    }
  });
}
```

### get(refOrPath, options)

##### Purpose

Fetch either a Collection or Document.

##### Arguments
  1. CollectionReference, DocumentReference or path (CollectionReference, DocumentReference or String)
  2. options (Object) only available on collections.
      - query : (Function - optional) a function that receives the created ref
      - withIds : (Boolean - optional) will embed firestore generated document ids inside each document in your collections on the `id` property.
      - withRefs : (Boolean - optional) will embed the DocumentReference inside each document in your collection on the `ref` property.

##### Return Value
  A Promise thats resolve with the resulting data or rejects if the document/collection does not exist or there are any read errors.

##### Example

```javascript
componentWillMount() {
  base.get(collectionRef, {
    context: this,
    query: (ref) => ref.where('type', '==', 'subscriber'),
  }).then(data => {
    //do something with data
  }).catch(err => {
    //handle error
  })
}
```

## Writing Data

### addToCollection(refOrPath, data, id)

##### Purpose

Add a new Document to a Collection.

##### Arguments
  1. CollectionReference or path (CollectionReference or String)
  2. Data (Object) the document data
  3. ID (String - optional) the id for the document. If omitted, the Firestore will generate an id for you.

##### Return Value
  A Promise that resolves when the write is complete or rejects with any error such as a permissions error.

##### Example

```javascript
componentWillMount() {
  base.addToCollection('myCollection', data, 'myCustomId')
    .then(() => {
      //document is added to the collection
    }).catch(err => {
    //handle error
  });
}
```

### updateDoc(refOrPath, data)

##### Purpose

Update an existing document

##### Arguments
  1. DocumentReference or path (DocumentReference or String)
  2. Data (Object) the document data

##### Return Value
  A Promise thats resolve when the write is complete or rejects with any error such as a permissions error.

##### Example

```javascript
componentWillMount() {
  base.updateDoc('myCollection/myDoc', data)
    .then(() => {
      //document is updated
    }).catch(err => {
    //handle error
  });
}
```

### removeDoc(refOrPath)

##### Purpose

Deletes a document

##### Arguments
  1. DocumentReference or path (DocumentReference or String)

##### Return Value
  A Promise thats resolve when the document is delete or rejects with any error such as a permissions error

##### Example

```javascript
componentWillMount() {
  base.removeDoc('myCollection/myDoc')
    .then(() => {
      //document is deleted
    }).catch(err => {
    //handle error
  });
}
```

### removeFromCollection(refOrPath, options)

##### Purpose

Removes documents from a collection. If no query is supplied, it will remove all the documents. If a query is supplied, it will only remove documents that match the query.

##### Arguments
  1. CollectionReference or path (CollectionReference or String)
  2. options (Object)
      - query : (Function - optional) a function that receives the created ref as its only argument. You can chain any Firestore queries you want to perform. See [Using Firestore Queries](#firestorequeries)

##### Return Value
  A Promise thats resolve when the write is complete or rejects with any error such as a permissions error.

##### Example

```javascript
componentWillMount() {
  base.bindCollection('myCollection', {
    context: this,
    state: 'users',
    withRefs: true,
    withIds: true,
    query: (ref) => ref.where('type', '==', 'subscriber'),
    then(data) {
     this.setState(state => ({
       ...state,
       loading: false
     }))
    },
    onFailure(err) {
      //handle error
    }
  });
}
```

## Sync Data

### syncDoc(refOrPath, options)

##### Purpose

Syncs a component's local state with a document in Firestore.

##### Arguments
  1. DocumentReference or path (DocumentReference or String)
  2. options (Object)
      - context : (Object - required) your react component
      - state : (String - required) the state property to sync
      - then : (Function - optional) a callback that will be called when the listener is set, use for loading indicators
      - onFailure : (Function - optional) a callback that will be called with any errors such as permissions errors

##### Return Value
  An object which you can pass to `removeBinding` if you want to remove the listener while the component is still mounted.

##### Example

```javascript
componentWillMount() {
  base.syncDoc('myCollection/myDoc', data)
    .then(() => {
      //document is updated
    }).catch(err => {
    //handle error
  });
}
```

## Remove Listeners

### <a name="fs-remove-binding">removeBinding(ref)</a>

##### Purpose
Clean up a listener. Listeners are automatically cleaned up when components unmount, however if you wish to remove a listener while the component is still mounted this will allow you to do that. An example would be if you want to start listening to a new document or change a query on all collection in response to a prop change.

##### Arguments
  1. ref (Object)
  - The return value of `listenToCollection`, `bindCollection`, `listenToDoc`,`bindDoc` or `syncDoc`

##### Return Value
  No return value

##### Example

```javascript
componentDidMount(){
  this.ref = base.syncDoc('users/user-1-doc',
    context: this,
    state: 'users'
  });
}
componentWillUnmount(){
  base.removeBinding(this.ref);
}
```

<br />


### <a name="fs-reset">reset()</a>

##### Purpose
  Removes every Firestore listener.

##### Arguments
  No Arguments

##### Return Value
  No return value

<br />


### <a name='firestorequeries'>Using Firestore Queries</a>

Use the query option to utilize the [Firestore Query](https://firebase.google.com/docs/reference/js/firebase.firestore.Query) API.  For a list of available queries and how they work, see the Firestore docs.

Queries are accepted in the `options` object of each collection read method (`listenToCollection`, `bindCollection`, `get(Collection)`). You can also use them with `removeFromCollection` to remove documents that match the query

The query options takes a function that will receive the collection reference as its only argument. You can then apply any of the available methods you with to run and must return the reference.

```javascript
base.bindCollection('users', {
  state: 'users',
  context: this,
  query: (ref) => {
    return ref.where('type', '==', 'subscriber')
              .where('joined', '>', yesterday)
              .orderBy('joined');
  }
})
```


## <a name='upgrading'>Upgrading to re-base 3.x from 2.x</a>

### Major Changes: ###

3.x no longer requires you to include the full Firebase SDK in your app. This means that you need to include the parts of Firebase SDK you wish to use and handle initialization of the firebase services in your app instead of re-base doing this for you. re-base only requires you pass it the initialized database service. This also means that the authentication helpers are deprecated and re-base no longer exposes the firebase services.

3.x also removes listeners automatically for you on `componentWillUnmount`
so you don't have to explicitly call `removeBinding`. `removeBinding` is still available if you need to remove a listener while the component is still mounted.
For instance, if you are adding and removing listeners in response to a prop change.

To help with migrating to 3.x please see the [Migration Guide](docs/MIGRATION.md)
for the equivalent Firebase SDK methods to use for the deprecated auth helpers.

Changes your re-base initialization:

**Change** this....
```javascript

var Rebase = require('re-base');
var base = Rebase.createClass({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
});

```

***To*** this...
```javascript

var Rebase = require('re-base');
var firebase = require('firebase');
var app = firebase.initializeApp({
      apiKey: "apiKey",
      authDomain: "projectId.firebaseapp.com",
      databaseURL: "https://databaseName.firebaseio.com",
      storageBucket: "bucket.appspot.com",
});
var base = Rebase.createClass(app.database());

```

### Changes to Database methods
<hr />

No changes. Your existing code should work.

<br />

### Changes to Authentication methods
<hr />


***Deprecated Methods***

`base.resetPassword`
`base.createUser`
`base.authWithPassword`
`base.authWithCustomToken`
`base.authWithOAuthPopup`
`base.getOAuthRedirectResult`
`base.authWithOAuthToken`
`base.authWithOAuthRedirect`
`base.onAuth`
`base.unauth`
`base.getAuth`


## Contributing

1. `npm install`
2. Add/edit tests in `tests/specs`
3. Add/edit source in `src`
4. `npm test`

## Credits

re-base is inspired by ReactFire from Firebase. Jacob Turner is also a core contributor and this wouldn't have been possible without his assistance.

## License

MIT
