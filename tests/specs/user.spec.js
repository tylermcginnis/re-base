var Rebase = require('../../dist/bundle');
var firebase = require('firebase');

var dummyUsers = require('../fixtures/dummyUsers');
var config = require('../fixtures/config');

describe('User tests', function(){
  var base;

  beforeEach(() => {
    base = Rebase.createClass(config);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  describe('createUser()', function(){

    it('Fails to create with invalid email', function(done) {
      base.createUser({
        email: dummyUsers.invalid.email,
        password: dummyUsers.invalid.password,
      }, function(error, userData) {
          expect(error).not.toBeNull();
          expect(userData).toBeUndefined();
          done();
      });
    });

    it('Succeeds to create a valid user', function(done) {
      base.createUser({
          email: dummyUsers.toDelete.email,
          password: dummyUsers.toDelete.password,
        }, function(error, userData) {
          expect(error).toBeNull();
          expect(userData).not.toBeNull();
          //delete user 
          userData.delete().then(() => {
            done();
          });
        });
    });

  });

  describe('resetPassword()', function(){

    it('Fails to reset password for non-existant user', function(done) {
      base.resetPassword({
        email: dummyUsers.unknown.email,
      }, function(error) {
        expect(error).not.toBeNull();
        done();
      });
    });

    it('Succeeds to reset password for a user', function(done) {
      base.createUser({
        email: dummyUsers.toDelete.email,
        password: dummyUsers.toDelete.password,
      }, function (error,userData){
          base.resetPassword({
            email: dummyUsers.toDelete.email,
          }, function(error) {
            expect(error).toBeNull();
            //delete user 
            userData.delete().then(() => {
              done();
            });
          });
      });
    });

  });
});
  
