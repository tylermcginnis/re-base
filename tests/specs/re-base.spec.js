var Rebase = require('../../dist/bundle');

describe('re-base Tests:', function(){
  describe('createClass', function(){
    it('returns an object', function(){
      var base = Rebase.createClass('https://edqio.firebaseio.com/');
      expect(base).not.toBe(undefined);
    });
  });
});