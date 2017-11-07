const Rebase = require('../../../dist/bundle');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('updateDoc()', function() {
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
    seedCollection().then(done);
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
      const docRef = collectionRef.doc(`doc-${doc.id}`);
      return docRef.set(doc);
    });
    return Promise.all(docs);
  }

  it('it throws an error given a invalid endpoint', done => {
    try {
      base.updateDoc('collection', { key: 'value' });
    } catch (err) {
      expect(err.code).toEqual('INVALID_ENDPOINT');
      done();
    }
  });

  it('updates a document', done => {
    base
      .updateDoc(`${collectionPath}/doc-1`, {
        name: 'Updated Document'
      })
      .then(() => {
        collectionRef
          .doc('doc-1')
          .get()
          .then(doc => {
            const data = doc.data();
            expect(data.name).toEqual('Updated Document');
            done();
          });
      })
      .catch(err => done.fail(err));
  });

  it('errors on permission fail', done => {
    base
      .updateDoc(`readFail/doc-1`, {
        name: 'Updated Document'
      })
      .then(() => {
        done.fail('should reject');
      })
      .catch(err => {
        expect(err.code).toEqual('permission-denied');
        done();
      });
  });
});
