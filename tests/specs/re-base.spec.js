var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var invalidFirebaseURLs = [null, undefined, true, false, [], 0, 5, "", "a", ["hi", 1]];
var firebaseUrl = 'https://rebase-demo.firebaseio.com/';

describe('re-base Tests:', function(){
  beforeEach(function(){

  });

  afterEach(function(){

  });

  describe('createClass()', function(){
    it('createClass() throws an error given a invalid Firebase URL', function(){
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
});