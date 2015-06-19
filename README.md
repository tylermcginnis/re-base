# re-base
[![Build Status](https://travis-ci.org/tylermcginnis/re-base.svg?branch=master)](https://travis-ci.org/tylermcginnis/re-base)
[![Coverage Status](https://coveralls.io/repos/tylermcginnis/re-base/badge.svg)](https://coveralls.io/r/tylermcginnis/re-base)

# What is re-base?

React.js makes managing state easy to reason about. Firebase makes persisting your data easy to implement. re-base combines the two ideas by allowing you to bind your component's state to a Firebase endpoint and much more.

# Why re-base?

I spent a few weeks trying to figure out the cleanest way to implement Firebase into my React/Flux application. After struggling for a bit, I [tweeted](https://twitter.com/tylermcginnis33/status/605838057825132549) my frustrations. I was enlightened to the fact that Firebase and Flux really don't work well together. It makes sense why they don't work together, because they're both trying to accomplish roughly the same thing. So I did away with my reliance upon Flux and tried to think of a clean way to implement React with Firebase. I came across ReactFire built by Jacob Wenger at Firebase and loved his idea. Sync a Firebase endpoint with a property on your component's state. So whenever your data changes, your state will be updated. Simple as that. The problem with ReactFire is because it uses Mixins, it's not compatible with ES6 classes. After chatting with Jacob Turner, we wanted to create a way to allow the one way binding of ReactFire with ES6 classes along some more features like two way data binding and listening to Firebase endpoints without actually binding a state property to them. Thus, re-base was built.

# Features

- *syncState*: Two way data binding between any property on your component's state and any endpoint in Firebase. Use the same API you're used to to update your component's state (setState), and Firebase will also update.
- *bindToState*: One way data binding. Whenever your Firebase endpoint changes, the property on your state will update as well.
- *listenTo*: Whenever your Firebase endpoint changes, it will invoke a callback passing it the new data from Firebase.
- *fetch*: Retrieve data from Firebase without setting up any binding or listeners.
- *post*: Add new data to Firebase.

# Installing

```bash
$ npm install re-base
```

# API

#### For more in depth examples of the API, see the `examples` folder.

## createClass(firebaseUrl)

##### Purpose
    Accepts a firebase URL as its only parameter and returns a singleton with the re-base API.

##### Arguments
    firebaseUrl:
      - type: string
      - The absolute, HTTPS URL of your Firebase project

##### Return Value
    An object with syncState, bindToState, listenTo, fetch, post, removeBinding, and reset methods.

##### Example
    var Rebase = require('re-base');
    var base = Rebase.createClass('https://myapp.firebaseio.com');

<br />

## syncState

##### Purpose
    Allows you to set up two way data binding between your component's state and your Firebase. Whenever your Firebase changes, your component's state will change. Whenever your component's state changes, Firebase will change.

```js
/* Syncs your Firebase users endpoint (`https://myapp.firebaseio.com/users/someUserId`) with your components `user` property on your state */
base.syncState(`users/${userId}`, {
  context: this, // (required) The context of your component
  state: 'user', // (required) The state property you want to sync with Firebase
  asArray: false // (optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
});
```

```js
/* Calling `setState` as you normally would will now update your local state and the `users/${userId}` Firebase endpoint */
this.setState({
  user: {name: 'Tyler McGinnis', age: 25}
});
```

### bindToState

Purpose: One way data binding from Firebase to your component's state. Allows you to bind a component's state property to a Firebase endpoint so whenever that Firebase endpoint changes, your component's state will be updated with that change.

```js
base.bindToState('tasks', {
  context: this, // (required) The context of your component
  state: 'tasks' // (required) The state property which will update when the 'tasks' endpoint in Firebase changes
  asArray: true // (optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
});
```

### listenTo

Purpose: Allows you to listen to Firebase endpoints without binding those changes to a state property. Instead, a callback will be invoked with said changes.

```js
base.listenTo('votes', {
  context: this, //The context of your component (required)
  asArray: true, //Returns the Firebase data at the specified endpoint as an Array instead of an Object (optional)
  then(votesData){ //The callback function that will be invoked with the data from the specified endpoint when the endpoint changes (required)
    var total = 0;
    votesData.forEach((vote, index) => {
      total += vote
    });
    this.setState({total});
  }
})
```

### fetch

Purpose: Allows you to retrieve the data from a Firebase endpoint just once without subscribing or listening for data changes.

```js
base.fetch('sales', {
  context: this, // (required) The context of your component
  asArray: true, // (optional) Returns the Firebase data at the specified endpoint as an Array instead of an Object
  then(data){ // (required) The function that will get invoked once when the data is received from Firebase
    parseSales(data);
  }
});
```

### post

Purpose: Allows you to update a Firebase endpoint with new data.

```js
base.post('users', {
  data: {name: 'Tyler McGinnis', age: 25}, // (required) The new data for Firebase
  then(){ // (optional) A callback that will get invoked once the new data has been added to Firebase
    dataAdded(true);
  }
});
```

### removeBinding

Purpose: Remove the listeners to Firebase when your component unmounts.

```js
componentDidMount(){
  this.ref = base.syncState('users', {
    context: this,
    state: 'users'
  });
}
componentWillUnmount(){
  base.removeListener(this.ref);
}
```


## Credits

re-base is inspired by ReactFire from Firebase. Jacob Turner is also a core contributor and this wouldn't have been possible without his assistance.

## License

MIT
