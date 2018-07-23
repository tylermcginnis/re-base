const Rebase = require('../../../src/rebase');
var firebase = require('firebase/app');
require('firebase/database');

var firebaseConfig = require('../../fixtures/config');

describe('Firebase Server Info', function() {
  var base;
  var app;

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    app.delete().then(done);
  });

  it('correctly retrieves Server Time Offset', done => {
    base.fetch('.info/serverTimeOffset', {
      context: this,
      then: data => {
        expect(data).toEqual(jasmine.any(Number));
        done();
      }
    });
  });
});
