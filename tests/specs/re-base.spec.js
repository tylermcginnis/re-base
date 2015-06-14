var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('re-base Tests:', function(){
  beforeEach(function(){
    this.base = Rebase.createClass('https://rebase-demo.firebaseio.com/');
  });

  describe('createClass()', function(){
    it('createClass() returns an object with the correct API', function(){
      expect(this.base.listenTo).toBeDefined();
      expect(this.base.bindToState).toBeDefined();
      expect(this.base.syncState).toBeDefined();
      expect(this.base.fetch).toBeDefined();
      expect(this.base.post).toBeDefined();
      expect(this.base.removeBinding).toBeDefined();
      expect(this.base.listenTo).toEqual(jasmine.any(Function));
      expect(this.base.bindToState).toEqual(jasmine.any(Function));
      expect(this.base.syncState).toEqual(jasmine.any(Function));
      expect(this.base.fetch).toEqual(jasmine.any(Function));
      expect(this.base.post).toEqual(jasmine.any(Function));
      expect(this.base.removeBinding).toEqual(jasmine.any(Function));
    });
  });
});