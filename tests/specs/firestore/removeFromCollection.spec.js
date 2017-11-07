const Rebase = require('../../../dist/bundle');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('removeCollection()', function() {
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
      return collectionRef.add(doc);
    });
    return Promise.all(docs);
  }

  it('validates paths', done => {
    try {
      base.removeFromCollection('testCollection/doc');
    } catch (err) {
      expect(err.code).toEqual('INVALID_ENDPOINT');
      done();
    }
  });

  it('removes all the documents from a collection', done => {
    base
      .removeFromCollection(collectionPath)
      .then(() => {
        collectionRef
          .get()
          .then(snapshot => {
            expect(snapshot.empty).toBe(true);
            done();
          })
          .catch(err => done.fail(err));
      })
      .catch(err => done.fail(err));
  });

  it('removes documents that match a query', done => {
    base
      .removeFromCollection(collectionPath, {
        query: ref =>
          ref
            .where('id', '<', 5)
            .where('id', '>', 2)
            .orderBy('id')
      })
      .then(() => {
        collectionRef.get().then(snapshot => {
          expect(snapshot.empty).toBe(false);
          expect(snapshot.docs.length).toBe(3);
          done();
        });
      })
      .catch(err => done.fail(err));
  });
});