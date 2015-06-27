# re-base (WIP)
[![Build Status](https://travis-ci.org/tylermcginnis/re-base.svg?branch=master)](https://travis-ci.org/tylermcginnis/re-base)
[![Coverage Status](https://coveralls.io/repos/tylermcginnis/re-base/badge.svg)](https://coveralls.io/r/tylermcginnis/re-base)

# What is re-base?

React.js makes managing state easy to reason about. Firebase makes persisting your data easy to implement. re-base combines the two ideas by allowing you to bind your component's state to a Firebase endpoint and much more. Forget about your data persistance and focus on what really matters, your application's state.

# Why re-base?

I spent a few weeks trying to figure out the cleanest way to implement Firebase into my React/Flux application. After struggling for a bit, I [tweeted](https://twitter.com/tylermcginnis33/status/605838057825132549) my frustrations. I was enlightened to the fact that Firebase and Flux really don't work well together. It makes sense why they don't work together, because they're both trying to accomplish roughly the same thing. So I did away with my reliance upon Flux and tried to think of a clean way to implement React with Firebase. I came across ReactFire built by Jacob Wenger at Firebase and loved his idea. Sync a Firebase endpoint with a property on your component's state. So whenever your data changes, your state will be updated. Simple as that. The problem with ReactFire is because it uses Mixins, it's not compatible with ES6 classes. After chatting with Jacob Turner, we wanted to create a way to allow the one way binding of ReactFire with ES6 classes along some more features like two way data binding and listening to Firebase endpoints without actually binding a state property to them. Thus, re-base was built.

# Features

- *syncState*: Two way data binding between any property on your component's state and any endpoint in Firebase. Use the same API you're used to to update your component's state (setState), and Firebase will also update.
- *bindToState*: One way data binding. Whenever your Firebase endpoint changes, the property on your state will update as well.
- *listenTo*: Whenever your Firebase endpoint changes, it will invoke a callback passing it the new data from Firebase.
- *fetch*: Retrieve data from Firebase without setting up any binding or listeners.
- *post*: Add new data to Firebase.
- *removeBinding*: Remove all of the Firebase listeners when your component unmounts.
- *reset*: Removes all of the Firebase listeners and resets the singleton (for testing purposes).

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
  1. firebaseUrl:
      - type: string
      - The absolute, HTTPS URL of your Firebase project

##### Return Value
  An object with syncState, bindToState, listenTo, fetch, post, removeBinding, and reset methods.

##### Example
    var Rebase = require('re-base');
    var base = Rebase.createClass('https://myapp.firebaseio.com');

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

#### Return Value
  An object which you can pass to `clearBinding` when your component unmounts to remove the Firebase listeners.

#### Example
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

#### Return Value
  An object which you can pass to `clearBinding` when your component unmounts to remove the Firebase listeners.

#### Example
    componentDidMount(){
      base.bindToState('tasks', {
        context: this,
        state: 'tasks'
        asArray: true
      });
    }

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

#### Return Value
  An object which you can pass to `clearBinding` when your component unmounts to remove the Firebase listeners.

#### Example
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

#### Return Value
  No return value

#### Example
    getSales(){
      base.fetch('sales', {
        context: this,
        asArray: true,
        then(data){
          console.log(data);
        }
      });
    }

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
      - then: (function - optional) A callback that will get invoked once the new data has been saved to Firebase

#### Return Value
  No return value

#### Example
    addUser(){
      base.post('users/${userId}', {
        data: {name: 'Tyler McGinnis', age: 25},
        then(){
          Router.transitionTo('dashboard');
        }
      });
    }

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
    componentDidMount(){
      this.ref = base.syncState('users', {
        context: this,
        state: 'users'
      });
    }
    componentWillUnmount(){
      base.removeBinding(this.ref);
    }

<br />

## reset()

#### Purpose
  Removes every Firebase listener and resets all private variables. Used for testing purposes.

#### Arguments
  No Arguments

#### Return Value
  No return value

<br />

## Credits

re-base is inspired by ReactFire from Firebase. Jacob Turner is also a core contributor and this wouldn't have been possible without his assistance.

## License

MIT
