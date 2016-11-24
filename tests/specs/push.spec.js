var Rebase = require('../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');

var invalidEndpoints = require('../fixtures/invalidEndpoints');
var dummyObjData = require('../fixtures/dummyObjData');
var invalidOptions = require('../fixtures/invalidOptions');
var firebaseConfig = require('../fixtures/config');

describe('push()', function(){
  var base;
  var testEndpoint = 'test/push';

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

  it('push() throws an error given a invalid endpoint', function(){
    invalidEndpoints.forEach((endpoint) => {
      try {
        base.push(endpoint, {
          data: dummyObjData
        })
      } catch(err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
      }
    });
  });

  it('push() throws an error given an invalid options object', function(){
    invalidOptions.forEach((option) => {
      try {
        base.push(testEndpoint, option);
      } catch(err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  it('push() returns a Firebase reference for the generated location', function(){
    var returnedRef = base.push(testEndpoint, {
      data: dummyObjData
    });
    var endpointBaseUrl = returnedRef.parent.toString();
    expect(endpointBaseUrl).toEqual(`${firebaseConfig.databaseURL}/${testEndpoint}`);
    expect(returnedRef.key).toEqual(jasmine.any(String));
  });

  it('push() updates Firebase correctly', function(done){
    base.push(testEndpoint, {
      data: dummyObjData,
      then(){
        var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
        var ref = testApp.database().ref();
        ref.child(testEndpoint).once('value', (snapshot) => {
          var keyedData = snapshot.val();
          var data = keyedData[Object.keys(keyedData)[0]];
          expect(data).toEqual(dummyObjData);
          testApp.delete().then(done);
        });
      }
    })
  });

});
