var Rebase = require('../../src/rebase.js');
var firebase = require('firebase');

var dummyUsers = require('../fixtures/dummyUsers');
var config = require('../fixtures/config');

describe('Auth tests', function(){
  var base;

  beforeEach(() => {
    base = Rebase.createClass(config);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  describe('authWithPassword()', function(){

    it('fails to log with in an unknown user', function(done){
      base.authWithPassword({
        email: dummyUsers.unknown.email,
        password: dummyUsers.unknown.password
      }, function(error, authData) {
          expect(error).not.toBeNull();
          expect(authData).toBeUndefined();
          done();
      });
    });

    it('succeeds to log in with a known user', function(done){
      base.authWithPassword({
        email: dummyUsers.known.email,
        password: dummyUsers.known.password
      }, function(error, authData) {
          expect(error).toBeNull();
          expect(authData).not.toBeNull();
          done();
      });
    });

  });

  describe('onAuth()', function(){

    it('Listens to the auth event', function(done){
      var unsubscribe = base.onAuth(authData => {
        expect(authData).not.toBeNull();
        //unsubscribe auth listener
        unsubscribe();
        done();
      });
    });

  });

  describe('getAuth()', function(){

    it('Succeeds to get users authentication data', function(done) {
      //sign in first
      base.authWithPassword({
          email: dummyUsers.known.email,
          password: dummyUsers.known.password
      }, function(error, authData){
          expect(error).toBeNull();
          var currentUser = base.getAuth();
          expect(currentUser).toEqual(authData);
          done();
      });
    });

  });

  describe('unauth()', function() {

    it('unauth() should log the user out', function(done){
      //sign in first
      base.authWithPassword({
          email: dummyUsers.known.email,
          password: dummyUsers.known.password
      }, function(error, authData){
          //expect user is logged in
          expect(error).toBeNull();
          var currentUser = base.getAuth();
          expect(currentUser).toEqual(authData);
          //log user out
          base.unauth();
          setTimeout(() => {
            //expect user is now logged out
            var user = base.getAuth();
            expect(user).toBeNull();
            done();
          }, 200);
      });
    });

  });

  describe('authWithOAuthPopup()', function(){

    it('authWithOAuthPopup() should throw an error if unknown provider requested', function(done){
        try {
          base.authWithOAuthPopup('someauthprovider', function(error, authData){
            done('authWithOAuthPopup() should throw but did not');
          });
        } catch(err) {
            expect(err.code).toEqual('UNKNOWN AUTH PROVIDER');
            done();
        }
    });

  });

});
