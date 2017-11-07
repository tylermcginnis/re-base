const Rebase = require('../../../dist/bundle');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('removeDoc()', function() {
  var base;
  var testApp;
  var collectionPath = 'testCollection';
  var collectionRef;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    collectionRef = testApp.firestore().collection(collectionPath);
  });

  afterAll(done => {
    testApp.delete().then(done);
  });

  beforeEach(done => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);
    base = Rebase.createClass(db);
    seedCollection()
      .then(done)
      .catch(err => done.fail(err));
  });

  afterEach(done => {
    Promise.all([
      collectionRef.get().then(docs => {
        const deleteOps = [];
        docs.forEach(doc => {
          deleteOps.push(doc.ref.delete());
        });
        return Promise.all(deleteOps);
      }),
      app.delete()
    ])
      .then(done)
      .catch(err => done.fail(err));
  });

  function seedCollection() {
    const docs = dummyCollection.map(doc => {
      const docRef = collectionRef.doc(doc.id.toString());
      return docRef.set(doc);
    });
    return Promise.all(docs);
  }

  describe('removeDoc', () => {
    it('deletes a document from firestore', done => {
      base
        .removeDoc(`${collectionPath}/1`)
        .then(() => {
          return collectionRef
            .doc('1')
            .get()
            .then(snapshot => {
              expect(snapshot.exists).toEqual(false);
              done();
            });
        })
        .catch(err => done.fail(err));
    });

    it('rejects if you dont have write permissions', done => {
      base
        .removeDoc('writeFail/1')
        .then(() => {
          done.fail('promise should reject');
        })
        .catch(err => {
          expect(err).not.toBeNull();
          done();
        });
    });
  });
});
