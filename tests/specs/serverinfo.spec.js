var Rebase = require('../../src/rebase.js');
var firebase = require('firebase');

var config = require('../fixtures/config');

describe('Firebase Server Info', function(){
  var base;

  beforeEach(() => {
    base = Rebase.createClass(config);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  it('correctly retrieves Server Time Offset', function(done){
    base.fetch('.info/serverTimeOffset', {
      context: this,
      then: data => {
        expect(data).toEqual(jasmine.any(Number));
        done();
      }
    });
  });

});
