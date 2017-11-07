var Rebase = require('../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase/app');
require('firebase/database');
require('firebase/firestore');

var dummyArrData = require('../fixtures/dummyArrData');
var dummyCollection = require('../fixtures/dummyCollection');
var firebaseConfig = require('../fixtures/config');

describe('Firebase/Firestore Interop', function() {
  var base;
  var fsBase;
  var testEndpoint = 'test/bindToState';
  var collectionPath = 'testCollection';
  var collectionRef;
  var testApp;
  var ref;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
    collectionRef = testApp.firestore().collection(collectionPath);
    var mountNode = document.createElement('div');
    mountNode.setAttribute('id', 'mount');
    document.body.appendChild(mountNode);
  });

  afterAll(done => {
    testApp.delete().then(done);
    var mountNode = document.getElementById('mount');
    mountNode.parentNode.removeChild(mountNode);
  });

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = firebase.database(app);
    var fsDb = firebase.firestore(app);
    base = Rebase.createClass(db);
    fsBase = Rebase.createClass(fsDb);
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.getElementById('mount'));
    Promise.all([
      collectionRef.get().then(docs => {
        const deleteOps = [];
        docs.forEach(doc => {
          deleteOps.push(doc.ref.delete());
        });
        return Promise.all(deleteOps);
      }),
      ref.child(testEndpoint).set(null)
    ])
      .then(() => app.delete())
      .then(done);
  });

  fit('both databases can be used side by side', done => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          friends: [],
          documents: []
        };
      }
      componentWillMount() {
        base.bindToState(`${testEndpoint}/myFriends`, {
          context: this,
          state: 'friends',
          asArray: true
        });
        fsBase.bindCollection(collectionPath, {
          state: 'documents',
          context: this
        });
      }
      componentDidMount() {
        Promise.all(
          ref.child(`${testEndpoint}/myFriends`).set(dummyArrData),
          collectionRef.add(dummyCollection[0])
        );
      }
      componentDidUpdate() {
        if (this.state.friends.length && this.state.documents.length) {
          expect(this.state.friends).toEqual(dummyArrData);
          expect(this.state.documents[0]).toEqual(dummyCollection[0]);
          done();
        }
      }
      render() {
        return <div>No Data</div>;
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });
});
