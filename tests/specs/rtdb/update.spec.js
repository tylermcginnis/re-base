var Rebase = require('../../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var database = require('firebase/database');

var invalidEndpoints = require('../../fixtures/invalidEndpoints');
var dummyObjData = require('../../fixtures/dummyObjData');
var invalidOptions = require('../../fixtures/invalidOptions');
var firebaseConfig = require('../../fixtures/config');

describe('update()', function() {
  var base;
  var testEndpoint = 'test/update';
  var testApp;
  var ref;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'CLEAN_UP');
    ref = testApp.database().ref();
  });

  afterAll(done => {
    testApp.delete().then(done);
  });

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    firebase.Promise
      .all([app.delete(), ref.child(testEndpoint).set(null)])
      .then(done)
      .catch(done.fail);
  });

  it('update() throws an error given a invalid endpoint', function() {
    invalidEndpoints.forEach(endpoint => {
      try {
        base.update(endpoint, {
          data: dummyObjData
        });
      } catch (err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
      }
    });
  });

  it('update() throws an error given an invalid options object', function() {
    invalidOptions.forEach(option => {
      try {
        base.update(testEndpoint, option);
      } catch (err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  it('update() updates Firebase correctly without deleting pre existing properties', done => {
    var prePopData = { name: 'Chris Buusmann', age: 29, human: true };
    base.post(testEndpoint, {
      data: prePopData,
      then() {
        base.update(testEndpoint, {
          data: dummyObjData,
          then() {
            var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
            var db = testApp.database().ref();
            db.child(testEndpoint).once('value', snapshot => {
              var data = snapshot.val();
              expect(data.human).toEqual(true);
              testApp.delete().then(done);
            });
          }
        });
      }
    });
  });

  it('update() returns a Promise that resolves on successful write', done => {
    var prePopData = { name: 'Chris Buusmann', age: 29, human: true };
    base.post(testEndpoint, {
      data: prePopData,
      then() {
        base
          .update(testEndpoint, {
            data: dummyObjData
          })
          .then(() => {
            var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
            var ref = testApp.database().ref();
            ref.child(testEndpoint).on('value', snapshot => {
              var data = snapshot.val();
              if (data) {
                expect(data.human).toEqual(true);
                testApp.delete().then(done);
              }
            });
          })
          .catch(err => {
            done.fail('Promise rejected');
          });
      }
    });
  });
});
