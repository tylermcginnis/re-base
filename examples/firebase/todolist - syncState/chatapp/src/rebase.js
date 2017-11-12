import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

var app = firebase.initializeApp({
  apiKey: 'AIzaSyCETlSYkOH6Cut5Ii31THM3j5iOiHLz89Q',
  authDomain: 'qwales1-test-fa2c0.firebaseapp.com',
  databaseURL: 'https://qwales1-test-fa2c0.firebaseio.com',
  projectId: 'qwales1-test-fa2c0'
});

var db = firebase.database(app);
var base = Rebase.createClass(db);

export default base;
