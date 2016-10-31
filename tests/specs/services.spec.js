var Rebase = require('../../dist/bundle');
var firebase = require('firebase');

var config = require('../fixtures/config');

describe('Exposed firebase services', function(){
  var base;

  beforeEach(() => {
    base = Rebase.createClass(config);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  describe('storage', function(){
    it('storage service should be exposed', function(){
      expect(base.storage).not.toBeUndefined();
    });

    it('storage ref should be accessible', function(){
      var storage = base.storage();
      var ref = storage.ref();
      expect(ref.bucket).toEqual(config.storageBucket);
      expect(ref.child).toEqual(jasmine.any(Function));
    });
  });

  describe('auth', function(){
    it('auth service should be exposed', function(){
      expect(base.auth).not.toBeUndefined();
    });
  });

  describe('database', function(){
    it('database service should be exposed', function(){
      expect(base.database).not.toBeUndefined();
      var ref = base.database().ref();
      expect(ref.child).toEqual(jasmine.any(Function));
    });
  });

  describe('app', function(){
    it('app service should be exposed', function(){
      expect(base.app).not.toBeUndefined();
    });
  });

  describe('messaging', function(){
    it('messaging service should be exposed', function(){
      expect(base.messaging().onMessage).toEqual(jasmine.any(Function));
    });
  });

});
