const Rebase = require('../../../src/rebase');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('addToCollection()', function() {
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

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);
    base = Rebase.createClass(db);
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

  it('validates paths', done => {
    try {
      base.addToCollection('testCollection/doc', dummyCollection[0]);
    } catch (err) {
      expect(err.code).toEqual('INVALID_ENDPOINT');
      done();
    }
  });

  it('adds a document with a firestore generated id', done => {
    collectionRef.onSnapshot(snap => {
      if (!snap.empty) {
        snap.forEach(doc => {
          expect(doc.data().name).toEqual('Document 1');
        });
        done();
      }
    });
    base
      .addToCollection(`${collectionPath}`, dummyCollection[0])
      .catch(err => done.fail(err));
  });

  it('adds a document with provided id', done => {
    collectionRef.onSnapshot(snap => {
      if (!snap.empty) {
        expect(snap.docs[0].id).toEqual('my-id');
        done();
      }
    });
    base
      .addToCollection(`${collectionPath}`, dummyCollection[0], 'my-id')
      .catch(err => done.fail(err));
  });

  it('accepts a collection reference', done => {
    const testRef = app.firestore().collection('testCollection');
    collectionRef.onSnapshot(snap => {
      if (!snap.empty) {
        expect(snap.docs[0].id).toEqual('my-id');
        done();
      }
    });
    base
      .addToCollection(testRef, dummyCollection[0], 'my-id')
      .catch(err => done.fail(err));
  });

  it('rejects on permissions error', done => {
    base
      .addToCollection('writeFail', dummyCollection[0], 'my-id')
      .then(() => done.fail('should reject'))
      .catch(err => {
        expect(err.code).toEqual('permission-denied');
        done();
      });
  });
});
