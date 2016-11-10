var Rebase = require('../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');

var firebaseConfig = require('../fixtures/config');
var dummyObjData = require('../fixtures/dummyObjData');

describe('delete()', function(){
  var testEndpoint = 'test/delete';
  var testApp;
  var ref;

  beforeEach(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB');
    ref = testApp.database().ref();
  });

  afterEach(done => {
    var tearDown = [];
    ref.child(testEndpoint).set(null);
    var cleanUp = firebase.apps.map(app => app.delete().then(() => true));
    if(cleanUp.length > 0){
      firebase.Promise.all(cleanUp).then(done);
    } else {
      done();
    }
  });
  

  it('should delete the underlying firebase app', function(done){
    var app = Rebase.createClass(firebaseConfig, 'app1');
    expect(firebase.app('app1')).not.toBeUndefined();
    app.delete().then(() => {
      var initializedApps = firebase.apps.map(app => {
        return app.name;
      });
      expect(initializedApps).not.toContain('app1');
      done();
    });
  });

  it('should clear the listeners added by this instance of re-base', function(done){
    var app = Rebase.createClass(firebaseConfig, 'app2');
    //set up listener
    app.listenTo(testEndpoint, {
      context: {},
      then(data){
        done.fail('Listener should have been removed');
      }
    });
    app.delete().then(() => {
      ref.child(testEndpoint).set(dummyObjData).then(() => {
        setTimeout(done, 500);
      });
    });
  });

  it('should not clear the listeners added by other instances of re-base', function(done){
    var app1 = Rebase.createClass(firebaseConfig, 'app1');
    var app2 = Rebase.createClass(firebaseConfig, 'app2');
    //set up listener
    app1.listenTo(testEndpoint, {
      context: {},
      then(data){
        expect(data).toEqual(dummyObjData);
        app1.delete().then(done);
      }
    });
    app2.delete().then(() => {
      ref.child(testEndpoint).set(dummyObjData);
    });
  });

});
