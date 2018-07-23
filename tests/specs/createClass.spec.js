const Rebase = require('../../src/rebase');
var firebase = require('firebase/app');
require('firebase/database');
require('firebase/firestore');

var firebaseConfig = require('../fixtures/config');

describe('createClass()', function() {
  it('createClass() returns an object with the correct API for RTDB', done => {
    //setup
    var app = firebase.initializeApp(firebaseConfig);
    var db = firebase.database(app);
    var base = Rebase.createClass(db);

    expect(base.listenTo).toEqual(
      jasmine.any(Function),
      'Public API: listenTo() not exposed'
    );
    expect(base.bindToState).toEqual(
      jasmine.any(Function),
      'Public API: bindToState() not exposed'
    );
    expect(base.syncState).toEqual(
      jasmine.any(Function),
      'Public API: syncState() not exposed'
    );
    expect(base.fetch).toEqual(
      jasmine.any(Function),
      'Public API: fetch() not exposed'
    );
    expect(base.update).toEqual(
      jasmine.any(Function),
      'Public API: update() not exposed'
    );
    expect(base.post).toEqual(
      jasmine.any(Function),
      'Public API: post() not exposed'
    );
    expect(base.removeBinding).toEqual(
      jasmine.any(Function),
      'Public API: removeBinding() not exposed'
    );
    expect(base.remove).toEqual(
      jasmine.any(Function),
      'Public API: remove() not exposed'
    );
    expect(base.reset).toEqual(
      jasmine.any(Function),
      'Public API: reset() not exposed'
    );
    expect(base.initializedApp).toEqual(
      jasmine.any(Object),
      'Public API: initializedApp not exposed'
    );
    expect(base.timestamp).toEqual(
      { '.sv': 'timestamp' },
      'Public API: timestamp not exposed'
    );
    done();

    //clean up
    base = null;
    db = null;
    app
      .delete()
      .then(done)
      .catch(() => {
        done.fail('Firebase App not cleaned up after test');
      });
  });

  it('createClass() returns an object with the correct API for Firestore', done => {
    //setup
    var app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);
    db.settings({ timestampsInSnapshots: true });
    var base = Rebase.createClass(db);

    expect(base.bindDoc).toEqual(
      jasmine.any(Function),
      'Public API: bindDoc() not exposed'
    );
    expect(base.bindCollection).toEqual(
      jasmine.any(Function),
      'Public API: bindCollection() not exposed'
    );
    expect(base.syncDoc).toEqual(
      jasmine.any(Function),
      'Public API: syncDoc() not exposed'
    );
    expect(base.listenToDoc).toEqual(
      jasmine.any(Function),
      'Public API: listenToDoc() not exposed'
    );
    expect(base.listenToCollection).toEqual(
      jasmine.any(Function),
      'Public API: listenToCollection() not exposed'
    );
    expect(base.addToCollection).toEqual(
      jasmine.any(Function),
      'Public API: addToCollection() not exposed'
    );
    expect(base.updateDoc).toEqual(
      jasmine.any(Function),
      'Public API: updateDoc() not exposed'
    );
    expect(base.get).toEqual(
      jasmine.any(Function),
      'Public API: get() not exposed'
    );
    expect(base.removeDoc).toEqual(
      jasmine.any(Function),
      'Public API: removeDoc() not exposed'
    );
    expect(base.removeFromCollection).toEqual(
      jasmine.any(Function),
      'Public API: removeFromCollection() not exposed'
    );
    expect(base.removeBinding).toEqual(
      jasmine.any(Function),
      'Public API: removeBinding() not exposed'
    );
    expect(base.reset).toEqual(
      jasmine.any(Function),
      'Public API: reset() not exposed'
    );
    expect(base.initializedApp).toEqual(
      jasmine.any(Object),
      'Public API: initializedApp not exposed'
    );
    expect(base.timestamp).toEqual(
      firebase.firestore.FieldValue.serverTimestamp(),
      'Public API: timestamp not exposed'
    );
    done();

    //clean up
    base = null;
    db = null;
    app
      .delete()
      .then(done)
      .catch(() => {
        done.fail('Firebase App not cleaned up after test');
      });
  });

  it('createClass() should throw if not passed an initialized firebase database instance', function() {
    expect(function() {
      Rebase.createClass({});
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase or firestore database object.'
      )
    );
    expect(function() {
      Rebase.createClass(database);
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase or firestore database object.'
      )
    );
    expect(function() {
      Rebase.createClass('some string');
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase or firestore database object.'
      )
    );
  });
});
