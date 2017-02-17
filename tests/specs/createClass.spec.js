var Rebase = require('../../src/rebase.js');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');

var firebaseConfig = require('../fixtures/config');

describe('createClass()', function(){
  var base;

  beforeEach(() => {
    base = Rebase.createClass(firebaseConfig);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  it('createClass() returns an object with the correct API', function(){
    expect(base.delete).toEqual(jasmine.any(Function));
    expect(base.listenTo).toEqual(jasmine.any(Function));
    expect(base.bindToState).toEqual(jasmine.any(Function));
    expect(base.syncState).toEqual(jasmine.any(Function));
    expect(base.fetch).toEqual(jasmine.any(Function));
    expect(base.update).toEqual(jasmine.any(Function));
    expect(base.post).toEqual(jasmine.any(Function));
    expect(base.removeBinding).toEqual(jasmine.any(Function));
    expect(base.listenTo).toEqual(jasmine.any(Function));
    expect(base.bindToState).toEqual(jasmine.any(Function));
    expect(base.fetch).toEqual(jasmine.any(Function));
    expect(base.post).toEqual(jasmine.any(Function));
    expect(base.removeBinding).toEqual(jasmine.any(Function));
    expect(base.remove).toEqual(jasmine.any(Function));
    expect(base.authWithPassword).toEqual(jasmine.any(Function));
    expect(base.authWithOAuthPopup).toEqual(jasmine.any(Function));
    expect(base.authWithOAuthRedirect).toEqual(jasmine.any(Function));
    expect(base.authGetOAuthRedirectResult).toEqual(jasmine.any(Function));
    expect(base.authWithOAuthToken).toEqual(jasmine.any(Function));
    expect(base.authWithCustomToken).toEqual(jasmine.any(Function));
    expect(base.unauth).toEqual(jasmine.any(Function));
    expect(base.onAuth).toEqual(jasmine.any(Function));
    expect(base.createUser).toEqual(jasmine.any(Function));
    expect(base.resetPassword).toEqual(jasmine.any(Function));
    expect(base.storage).toEqual(jasmine.any(Function));
    expect(base.app).toEqual(jasmine.any(Function));
    expect(base.database).toEqual(jasmine.any(Function));
    expect(base.auth).toEqual(jasmine.any(Function));
    expect(base.messaging).toEqual(jasmine.any(Function));
  });

  it('createClass() returns the default app if it\'s already been initialized', function(){
    var nextBase = Rebase.createClass(firebaseConfig);
    expect(base.name).toEqual('[DEFAULT]');
    expect(base).toEqual(nextBase);
  });

  it('createClass() returns a named app', function(done){
    var namedBase = Rebase.createClass(firebaseConfig, 'namedApp');
    expect(namedBase.name).toEqual('namedApp');
    namedBase.delete().then(done);
  });

});
