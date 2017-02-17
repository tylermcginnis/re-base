var Rebase = require('../../src/rebase.js');
var firebase = require('firebase');
var firebaseConfig = require('../fixtures/config');
var dummyObjData = require('../fixtures/dummyObjData');

describe('remove()', function(){
  var base;
  var testEndpoint = 'test/remove';
  var testApp;
  var ref;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
  });

  afterAll(done => {
    testApp.delete().then(done);
  });

  beforeEach(done => {
    base = Rebase.createClass(firebaseConfig);
    done();
  });

  afterEach(done => {
    base.delete(() => {
      ref.child(testEndpoint).set(null).then(done);
    });
  });

  it('should remove all data at the location', function(done){
    //add data
    ref.child(testEndpoint).set(dummyObjData).then(() => {
      base.remove(testEndpoint).then(() => {
        ref.child(testEndpoint).once('value', snapshot => {
          var val = snapshot.val();
          expect(val).toBeNull();
          done();
        });
      });
    }).catch(err => {
      done.fail(err);
    });
  });

  it('should call the supplied callback after the data is removed', function(done){
    ref.child(testEndpoint).set(dummyObjData).then(() => {
      base.remove(testEndpoint, (err) => {
          if(err) return done.fail(err);
          ref.child(testEndpoint).once('value', snapshot => {
            var val = snapshot.val();
            expect(val).toBeNull();
            done();
          });
      });
    }).catch(err => {
      done.fail(err);
    });
  });

});
