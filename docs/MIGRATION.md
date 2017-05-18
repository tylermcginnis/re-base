# 2.x to 3.x Migration Guide

Here are some examples of how to replace the deprecated authentication methods.

The examples are assuming the use of the default firebase app instance (named '[DEFAULT]'). You can pass `auth()` an initialized firebase app in order to have the auth service associated with a different app instance.

Ex.

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var myApp = firebase.initializeApp(yourConfig, 'myApp');
var myAppAuth = firebase.auth(myApp);
```

### base.authWithPassword

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

app.auth().signInWithEmailAndPassword(email, password).then(user => {
  //
});
```
See [Firebase docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword) for more information.

### base.onAuth

```javascript

var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

app.auth().onAuthStateChanged(function(user, error) {
  //
});
```
See [Firebase docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged) for more information.

### base.unAuth

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().signOut().then(() => {
  //return value is null
});
```
See [Firebase docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signOut) for more information.

### base.getAuth

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().currentUser;
```
See [Firebase docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#currentUser) for more information.

### base.createUser

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().createUserWithEmailAndPassword(email,password).then(user => {
  //
});
```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword) for more information.
### base.resetPassword

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().sendPasswordResetEmail(email).then(...)
```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#sendPasswordResetEmail) for more information.

### base.authWithCustomToken

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().signInWithCustomToken(token).then(user => {
  //
})
```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithCustomToken) for more information.

### base.authWithOAuthPopup

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

var provider = new firebase.auth.FacebookAuthProvider();
auth().signInWithPopup(provider).then(() => {
  //return value is null
});

```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithPopup) for more information.

### base.getOAuthRedirectResult

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

auth().getRedirectResult().then(function(result) {
  //
});

```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#getRedirectResult) for more information.


### base.authWithOAuthToken
```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

var provider = new firebase.auth.FacebookAuthProvider();
var credential = provider.credential(OAuthToken, settings);

auth.signInWithCredential(credential).then(user => {
  //
});
```
See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithCredential)

### base.authWithOAuthRedirect

```javascript
var firebase = require('firebase/app');
require('firebase/auth');
var app = firebase.initializeApp(yourConfig);

var provider = new firebase.auth.FacebookAuthProvider();
auth().signInWithRedirect(provider).then(() => {
  //return value is null
});

```

See [Firebase Docs](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithRedirect) for more information.
