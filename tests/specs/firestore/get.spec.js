const Rebase = require('../../../dist/bundle');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('get()', function() {
  var base;
  var testApp;
  var collectionPath = 'testCollection';
  var collectionRef;
  var app;

  function seedCollection() {
    const docs = dummyCollection.map((doc, index) => {
      const docRef = collectionRef.doc(`doc-${index + 1}`);
      return docRef.set(doc);
    });
    return Promise.all(docs);
  }

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    collectionRef = testApp.firestore().collection(collectionPath);
    var mountNode = document.createElement('div');
    mountNode.setAttribute('id', 'mount');
    document.body.appendChild(mountNode);
  });

  afterAll(done => {
    var mountNode = document.getElementById('mount');
    mountNode.parentNode.removeChild(mountNode);
    testApp.delete().then(done);
  });

  beforeEach(done => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);
    base = Rebase.createClass(db);
    seedCollection().then(done);
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.body);
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

  it('get() validates endpoint', done => {
    try {
      base.get('').then(() => {
        done.fail('error should thrown');
      });
    } catch (err) {
      expect(err).not.toBeNull(err);
      done();
    }
  });

  describe('Async tests', function() {
    it('get() resolves with data from a collection', done => {
      base
        .get(collectionPath)
        .then(data => {
          expect(data.length).toEqual(5);
          done();
        })
        .catch(err => done.fail(err));
    });

    it('get() resolves with data from a collection query', done => {
      base
        .get(`${collectionPath}`, {
          query: ref =>
            ref
              .where('id', '<', 5)
              .where('id', '>', 2)
              .orderBy('id')
        })
        .then(data => {
          expect(data.length).toEqual(2);
          expect(data[0].name).toEqual('Document 3');
          expect(data[1].name).toEqual('Document 4');
          done();
        })
        .catch(err => done.fail(err));
    });

    it('get() rejects if collection query returns no results', done => {
      base
        .get(`${collectionPath}`, {
          query: ref => ref.where('id', '>', 5).orderBy('id')
        })
        .then(data => {
          done.fail('query should reject');
        })
        .catch(err => {
          expect(err.message).toEqual('No Result');
          done();
        });
    });

    it('get() rejects if document does not exist', done => {
      base
        .get(`${collectionPath}/nodoc`)
        .then(data => {
          done.fail('query should reject');
        })
        .catch(err => {
          expect(err.message).toEqual('No Result');
          done();
        });
    });

    it('get() resolves with a document', done => {
      base
        .get(`${collectionPath}/doc-1`)
        .then(data => {
          expect(data.name).toEqual(dummyCollection[0].name);
          done();
        })
        .catch(err => done.fail(err));
    });

    it('get() rejects Promise when read fails or is denied', done => {
      base
        .get('/readFail')
        .then(() => {
          done.fail('Promise should reject');
        })
        .catch(err => {
          expect(err.code).toContain('permission-denied');
          done();
        });
    });
  });
});
