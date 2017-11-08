const Rebase = require('../../../src/rebase.js');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var invalidEndpoints = require('../../fixtures/invalidEndpoints');
var dummyObjData = require('../../fixtures/dummyObjData');
var dummyArrayOfObjects = require('../../fixtures/dummyArrayOfObjects');
var invalidOptions = require('../../fixtures/invalidOptions');
var dummyArrData = require('../../fixtures/dummyArrData');
var firebaseConfig = require('../../fixtures/config');

describe('reset()', function() {
  var base;
  var testApp;
  var collectionPath = 'testCollection';
  var collectionRef;
  var app;

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

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore(app);
    base = Rebase.createClass(db);
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

  it('should remove listeners set by the app', done => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          user: {}
        };
      }
      componentDidMount() {
        this.ref = base.bindCollection(`${collectionPath}`, {
          context: this,
          state: 'user'
        });
        base.reset();
        collectionRef
          .doc('testDoc')
          .set({ user: 'abcdef' })
          .then(() => {
            setTimeout(done, 500);
          });
      }
      componentDidUpdate() {
        done.fail('listener should have been removed');
      }
      render() {
        return <div>No Data</div>;
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
        this.ref = base.syncDoc(`${collectionPath}/testDoc`, {
          context: this,
          state: 'user'
        });
        base.reset();
        collectionRef
          .doc('testDoc')
          .set({ user: 'abcdef' })
          .then(() => {
            setTimeout(done, 500);
          });
      }
      componentDidUpdate() {
        done.fail('Sync should have been removed');
      }
      render() {
        return <div>No Data</div>;
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });
});
