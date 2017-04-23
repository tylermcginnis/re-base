var Rebase = require('../../src/rebase.js');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase/app');
var database = require('firebase/database');

var firebaseConfig = require('../fixtures/config');

describe('createClass()', function() {
  it('createClass() returns an object with the correct API', done => {
    //setup
    var app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
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
    done();

    //clean up
    base = null;
    db = null;
    app.delete().then(done).catch(() => {
      done.fail('Firebase App not cleaned up after test');
    });
  });

  it('createClass() should throw if not passed an initialized firebase database instance', function() {
    expect(function() {
      Rebase.createClass({});
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase database object.'
      )
    );
    expect(function() {
      Rebase.createClass(database);
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase database object.'
      )
    );
    expect(function() {
      Rebase.createClass('some string');
    }).toThrow(
      new Error(
        'REBASE: Rebase.createClass failed. Expected an initialized firebase database object.'
      )
    );
  });
});
