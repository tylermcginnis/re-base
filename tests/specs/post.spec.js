var Rebase = require('../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');

var invalidEndpoints = require('../fixtures/invalidEndpoints');
var dummyObjData = require('../fixtures/dummyObjData');
var invalidOptions = require('../fixtures/invalidOptions');
var firebaseConfig = require('../fixtures/config');

describe('post()', function(){
  var base;
  var testEndpoint = 'test/post';

  beforeEach(done => {
    base = Rebase.createClass(firebaseConfig);
    done();
  });

  afterEach(done => {
    var testApp = firebase.initializeApp(firebaseConfig, 'CLEAN_UP');
    base.delete();
    testApp.database().ref(testEndpoint).set(null).then(() => {
      testApp.delete().then(done);
    });
  });

  it('post() throws an error given a invalid endpoint', function(){
    invalidEndpoints.forEach((endpoint) => {
      try {
        base.post(endpoint, {
          data: dummyObjData
        })
      } catch(err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
      }
    });
  });

  it('post() throws an error given an invalid options object', function(){
    invalidOptions.forEach((option) => {
      try {
        base.post(testEndpoint, option);
      } catch(err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  it('post() updates Firebase correctly', function(done){
    base.post(testEndpoint, {
      data: dummyObjData,
      then(){
        var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
        var ref = testApp.database().ref();
        ref.child(testEndpoint).once('value', (snapshot) => {
          var data = snapshot.val();
          expect(data).toEqual(dummyObjData);
          testApp.delete().then(done)
        });
      }
    })
  });

  it('post() returns a Promise that resolves on successful write', function(done){
    base.post(testEndpoint, {
       data: dummyObjData
    }).then(() => {
       var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
       var ref = testApp.database().ref();
       return ref.child(testEndpoint).once('value', (snapshot) => {
         var data = snapshot.val();
         expect(data).toEqual(dummyObjData);
         testApp.delete().then(done);
       });
    }).catch(err => {
       console.log(err.message);
       done.fail('Promise rejected');
   });
  });

});
