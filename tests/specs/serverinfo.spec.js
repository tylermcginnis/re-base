var Rebase = require('../../src/rebase.js');
var firebase = require('firebase');
var database = require('firebase/database');

var config = require('../fixtures/config');

describe('Firebase Server Info', function(){
  var base;
  var app;

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    app.delete().then(done);
  });

  it('correctly retrieves Server Time Offset', function(done){
    base.fetch('.info/serverTimeOffset', {
      context: this,
      then: data => {
        expect(data).toEqual(jasmine.any(Number));
        done();
      }
    });
  });

});
