var Rebase = require('../../dist/bundle');
var firebase = require('firebase');
var React = require('react');
var ReactDOM = require('react-dom');
var firebaseConfig = require('../fixtures/config');
var dummyObjData = require('../fixtures/dummyObjData');
var database = require('firebase/database');

describe('reset()', function() {
  var base;
  var ref;
  var testApp;
  var testEndpoint = 'test/reset';
  var app;

  beforeAll(() => {
    var mountNode = document.createElement('div');
    mountNode.setAttribute('id', 'mount');
    document.body.appendChild(mountNode);
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
  });

  afterAll(done => {
    var mountNode = document.getElementById('mount');
    mountNode.parentNode.removeChild(mountNode);
    testApp.delete().then(done);
  });

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    firebase.Promise
      .all([ref.child(testEndpoint).set(null), app.delete()])
      .then(done)
      .catch(done.fail);
  });

  it('should remove listeners set by the app', done => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          user: {}
        };
      }
      componentDidMount() {
        this.ref = base.bindToState(`${testEndpoint}`, {
          context: this,
          state: 'user'
        });
        base.reset();
        ref.child(testEndpoint).set({ user: 'abcdef' }).then(() => {
          setTimeout(done, 500);
        });
      }
      componentDidUpdate() {
        done.fail('listener should have been removed');
      }
      render() {
        return (
          <div>
            No Data
          </div>
        );
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });

  it('should remove syncs set by the app', done => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          user: {}
        };
      }
      componentDidMount() {
        this.ref = base.syncState(`${testEndpoint}`, {
          context: this,
          state: 'user'
        });
        base.reset();
        ref.child(testEndpoint).set({ user: 'abcdef' }).then(() => {
          setTimeout(done, 500);
        });
      }
      componentDidUpdate() {
        done.fail('Sync should have been removed');
      }
      render() {
        return (
          <div>
            No Data
          </div>
        );
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });
});
