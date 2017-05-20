var Rebase = require('../../dist/bundle');
var firebase = require('firebase');
var firebaseConfig = require('../fixtures/config');
var dummyObjData = require('../fixtures/dummyObjData');
var database = require('firebase/database');

describe('remove()', function() {
  var base;
  var testEndpoint = 'test/remove';
  var testApp;
  var ref;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
  });

  afterAll(done => {
    testApp.delete().then(done);
  });

  beforeEach(done => {
    app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
    base = Rebase.createClass(db);
    done();
  });

  afterEach(done => {
    firebase.Promise
      .all([ref.child(testEndpoint).set(null), app.delete()])
      .then(done)
      .catch(done.fail);
  });

  it('should remove all data at the location', done => {
    //add data
    ref
      .child(testEndpoint)
      .set(dummyObjData)
      .then(() => {
        base.remove(testEndpoint).then(() => {
          ref.child(testEndpoint).once('value', snapshot => {
            var val = snapshot.val();
            expect(val).toBeNull();
            done();
          });
        });
      })
      .catch(err => {
        done.fail(err);
      });
  });

  it('should call the supplied callback after the data is removed', done => {
    ref
      .child(testEndpoint)
      .set(dummyObjData)
      .then(() => {
        base.remove(testEndpoint, err => {
          if (err) return done.fail(err);
          ref.child(testEndpoint).once('value', snapshot => {
            var val = snapshot.val();
            expect(val).toBeNull();
            done();
          });
        });
      })
      .catch(err => {
        done.fail(err);
      });
  });
});
