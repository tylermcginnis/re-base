var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Firebase = require('firebase');

var invalidFirebaseURLs = [null, undefined, true, false, [], 0, 5, "", "a", ["hi", 1]];
var invalidEndpoints = ['', 'ab.cd', 'ab#cd', 'ab$cd', 'ab[cd', 'ab]cd'];
var firebaseUrl = 'https://rebase-demo.firebaseio.com/';
var dummyObjData = {name: 'Tyler McGinnis', age: 25};
var dummyArrData = ['Tyler McGinnis', 'Jacob Turner', 'Ean Platter'];
var testEndpoint = 'test/child';

describe('re-base Tests:', function(){
  beforeEach(function(done){
    var base = Rebase.createClass(firebaseUrl);
    base.post('test', {
      data: null,
      then(){
        done()
      }
    });
  });

  describe('createClass()', function(){
    it('createClass() throws an error given an invalid Firebase URL', function(){
      invalidFirebaseURLs.forEach(function(URL){
        try {
          Rebase.createClass(URL)
        } catch(err){
          expect(err.code).toEqual('INVALID_URL');
        }
      });
    });

    it('createClass() returns an object with the correct API', function(){
      var base = Rebase.createClass(firebaseUrl);
      expect(base.listenTo).toBeDefined();
      expect(base.bindToState).toBeDefined();
      expect(base.syncState).toBeDefined();
      expect(base.fetch).toBeDefined();
      expect(base.post).toBeDefined();
      expect(base.removeBinding).toBeDefined();
      expect(base.listenTo).toEqual(jasmine.any(Function));
      expect(base.bindToState).toEqual(jasmine.any(Function));
      expect(base.syncState).toEqual(jasmine.any(Function));
      expect(base.fetch).toEqual(jasmine.any(Function));
      expect(base.post).toEqual(jasmine.any(Function));
      expect(base.removeBinding).toEqual(jasmine.any(Function));
    });

    it('createClass() returns a singleton if it\'s already been invoked', function(){
      var base = Rebase.createClass(firebaseUrl);
      var newBase = Rebase.createClass(firebaseUrl);
      expect(base).toEqual(newBase);
    });
  });

  describe('post()', function(){
    it('post() throws an error given a invalid endpoint', function(){
      var base = Rebase.createClass(firebaseUrl);
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
      var base = Rebase.createClass(firebaseUrl);
      var invalidOptions = [[], {}, {then: function(){}}, {data: undefined}, {data: 123, then: 123}];
      invalidOptions.forEach((option) => {
        try {
          base.post(testEndpoint, option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
    });

    it('post() updates Firebase correctly', function(done){
      var base = Rebase.createClass(firebaseUrl);
      var ref = new Firebase(firebaseUrl);
      base.post(testEndpoint, {
        data: dummyObjData,
        then(thing){
          ref.child(testEndpoint).once('value', (snapshot) => {
            var data = snapshot.val();
            expect(data).toEqual(dummyObjData);
            done();
          });
        }
      })
    });
  });

  describe('fetch', function(){
    it('fetch() throws an error given a invalid endpoint', function(done){
      var base = Rebase.createClass(firebaseUrl);
      invalidEndpoints.forEach((endpoint) => {
        try {
          base.fetch(endpoint, {
            then(data){
              done();
            }
          })
        } catch(err) {
          expect(err.code).toEqual('INVALID_ENDPOINT');
          done();
        }
      });
    });

    it('fetch() throws an error given an invalid options object', function(){
      var base = Rebase.createClass(firebaseUrl);
      var invalidOptions = [[], {}, {then: undefined}, {then: 'strNotFn'}, {then: function(){}}, {onConnectionLoss: 'strNotFn'}];
      invalidOptions.forEach((option) => {
        try {
          base.fetch('test', option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
    });

    describe('Async tests', function(){
      beforeEach((done) => {
        var ref = new Firebase(firebaseUrl);
        ref.child(testEndpoint).set(dummyObjData, () => {
          done();
        });
      });

      it('fetch()\'s .then gets invoked with the data from Firebase once the data is retrieved', function(done){
        var base = Rebase.createClass(firebaseUrl);
        base.fetch(testEndpoint, {
          then(data){
            expect(data).toEqual(dummyObjData);
            done();
          }
        });
      });
    });
  });
});