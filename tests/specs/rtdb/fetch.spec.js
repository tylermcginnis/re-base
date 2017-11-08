const Rebase = require('../../../src/rebase');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase/app');
require('firebase/database');

var invalidEndpoints = require('../../fixtures/invalidEndpoints');
var dummyObjData = require('../../fixtures/dummyObjData');
var dummyNestedObjData = require('../../fixtures/dummyNestedObjData');
var invalidOptions = require('../../fixtures/invalidOptions');
var firebaseConfig = require('../../fixtures/config');
var nestedObjArrResult = require('../../fixtures/nestedObjArrResult');
var dummyArrData = require('../../fixtures/dummyArrData');

describe('fetch()', function() {
  var base;
  var testEndpoint = 'test/fetch';
  var app;

  beforeAll(() => {
    var mountNode = document.createElement('div');
    mountNode.setAttribute('id', 'mount');
    document.body.appendChild(mountNode);
  });

  afterAll(() => {
    var mountNode = document.getElementById('mount');
    mountNode.parentNode.removeChild(mountNode);
  });

  beforeEach(done => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.database(app);
    base = Rebase.createClass(db);
    done();
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.body);
    var testApp = firebase.initializeApp(firebaseConfig, 'CLEAN_UP');
    testApp
      .database()
      .ref(testEndpoint)
      .set(null)
      .then(() => {
        return firebase.Promise.all([app.delete(), testApp.delete()]);
      })
      .then(done)
      .catch(err => done.fail(err));
  });

  it('fetch() throws an error given a invalid endpoint', function() {
    invalidEndpoints.forEach(endpoint => {
      try {
        base.fetch(endpoint, {
          then(data) {}
        });
      } catch (err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
      }
    });
  });

  it('fetch() throws an error given an invalid options object', function() {
    invalidOptions.forEach(option => {
      try {
        base.fetch('test', option);
      } catch (err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  describe('Async tests', function() {
    beforeEach(done => {
      var testApp = firebase.initializeApp(firebaseConfig, 'DB_PREPOPULATE');
      var ref = testApp.database().ref();
      ref
        .child(testEndpoint)
        .set(dummyObjData)
        .then(() => {
          return testApp.delete();
        })
        .then(done);
    });

    it("fetch()'s .then gets invoked with the data from Firebase once the data is retrieved", done => {
      base.fetch(testEndpoint, {
        then(data) {
          expect(data).toEqual(dummyObjData);
          done();
        }
      });
    });

    it("fetch()'s .then gets invoked with the data from Firebase once the data is retrieved using returned Promise", done => {
      base
        .fetch(testEndpoint, {
          context: {}
        })
        .then(data => {
          expect(data).toEqual(dummyObjData);
          done();
        })
        .catch(done.fail);
    });

    it("fetch()'s asArray property should return the data from Firebase as an array", done => {
      base.fetch(testEndpoint, {
        asArray: true,
        context: {},
        then(data) {
          expect(data.indexOf('Tyler McGinnis')).not.toBe(-1);
          expect(data.indexOf(25)).not.toBe(-1);
          done();
        }
      });
    });

    it("fetch()'s asArray property should return the data from Firebase as an array when using returned Promise", done => {
      base
        .fetch(testEndpoint, {
          asArray: true,
          context: {}
        })
        .then(data => {
          expect(data.indexOf('Tyler McGinnis')).not.toBe(-1);
          expect(data.indexOf(25)).not.toBe(-1);
          done();
        })
        .catch(err => {
          done.fail(err);
        });
    });

    it("fetch()'s asArray property should add a key property on nested objects", done => {
      var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
      var ref = testApp.database().ref();
      ref.child(testEndpoint).set(dummyNestedObjData, () => {
        base.fetch(testEndpoint, {
          asArray: true,
          context: {},
          then(data) {
            expect(data).toEqual(nestedObjArrResult);
            testApp.delete().then(done);
          }
        });
      });
    });

    it("fetch()'s defaultValue returns defaultValue when there is no Firebase data", done => {
      base.fetch(`${testEndpoint}/abcdefg`, {
        defaultValue: 'test',
        context: {},
        then(data) {
          expect(data).toBe('test');
          done();
        }
      });
    });

    it('fetch() returns rejected Promise when read fails or is denied', done => {
      base
        .fetch('/readFail', { context: {} })
        .then(() => {
          done.fail('Promise should reject');
        })
        .catch(err => {
          expect(err.message).toContain('permission_denied');
          done();
        });
    });

    it('fetch() calls onFailure callback if present', done => {
      const spy = jasmine.createSpy();
      base.fetch('/readFail', { context: {}, onFailure: spy }).then(() => {
        expect(spy.calls.count()).toEqual(1);
        done();
      });
    });

    it('fetch() correctly updates the state of the component with data from fetch', done => {
      var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
      var ref = testApp.database().ref();
      ref.child(testEndpoint).set(dummyObjData);
      testApp.delete();
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentDidMount() {
          base.fetch(testEndpoint, {
            context: this,
            then(data) {
              this.setState({ data });
            }
          });
        }
        componentDidUpdate() {
          expect(this.state.data).toEqual(dummyObjData);
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('fetch() correctly updates the state of the component with data from fetch and asArray set to true', done => {
      var testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
      var ref = testApp.database().ref();
      ref.child(testEndpoint).set(dummyArrData);
      testApp.delete();
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            friends: []
          };
        }
        componentDidMount() {
          base.fetch(testEndpoint, {
            context: this,
            asArray: true,
            then(friends) {
              this.setState({ friends });
            }
          });
        }
        componentDidUpdate() {
          expect(this.state.friends).toEqual([25, 'Tyler McGinnis']);
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });
  });
});
