const Rebase = require('../../../src/rebase');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('listenToDoc()', function() {
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

  it('listenToDoc() returns a valid ref', function() {
    var ref = base.listenToDoc(`${collectionPath}/testDoc`, {
      context: this,
      then(data) {}
    });
    expect(ref.id).toEqual(jasmine.any(Number));
  });

  it('listenToDoc() validates endpoints', done => {
    try {
      base.listenToDoc('collection', {
        context: { setState: () => {} },
        state: 'prop',
        then() {
          done.fail('error should have been thrown');
        }
      });
    } catch (err) {
      expect(err.code).toEqual('INVALID_ENDPOINT');
      expect(err).not.toBe(null);
      done();
    }
  });

  it('listenToDoc() throws an error given an invalid options object', done => {
    try {
      base.listenToDoc(`${collectionPath}/testDoc`, {
        context: this
      });
    } catch (err) {
      expect(err.code).toEqual('INVALID_OPTIONS');
      done();
    }
  });

  describe('Async tests', function() {
    it("listenToDoc()'s .then method gets invoked when the document changes", done => {
      const ref = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        then(data) {
          expect(data).toEqual(dummyCollection[0]);
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it("listenToDoc()'s .then method gets invoked when the document changes", done => {
      const ref = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        then(data) {
          expect(data).toEqual(dummyCollection[0]);
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToDoc() accepts a document reference', done => {
      const docRef = app
        .firestore()
        .collection('testCollection')
        .doc('testDoc');
      const ref = base.listenToDoc(docRef, {
        context: {},
        then(data) {
          expect(data).toEqual(dummyCollection[0]);
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it("listenToDoc's .onFailure method gets invoked in the component context with error if permissions do not allow read", done => {
      const ref = base.listenToDoc('/readFail/testDoc', {
        context: this,
        onFailure(err) {
          expect(err).not.toBeUndefined();
          expect(err.code).toEqual('permission-denied');
          base.removeBinding(ref);
          done();
        },
        then(data) {
          done.fail(
            'Database permissions should not allow read from this location'
          );
        }
      });
    });

    it('listenToDoc embeds document reference if withRefs is true', done => {
      const ref = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        withRefs: true,
        then(data) {
          expect(data.ref).toEqual(
            jasmine.any(firebase.firestore.DocumentReference)
          );
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToDoc embeds document id if withIds is true', done => {
      const ref = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        withIds: true,
        then(data) {
          expect(data.id).toEqual(jasmine.any(String));
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToDoc should allow multiple listeners to same document', done => {
      let updateCount = 0;
      const ref1 = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        then(data) {
          updateCount++;
          expect(data).toEqual(dummyCollection[0]);
          base.removeBinding(ref1);
          if (updateCount === 2) {
            done();
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
      const ref2 = base.listenToDoc(`${collectionPath}/testDoc`, {
        context: {},
        then(data) {
          updateCount++;
          expect(data).toEqual(dummyCollection[0]);
          base.removeBinding(ref2);
          if (updateCount === 2) {
            done();
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });
  });

  it('listeners are removed when component unmounts', done => {
    spyOn(console, 'error');
    var componentWillMountSpy = jasmine.createSpy('componentWillMountSpy');
    class ChildComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {}
        };
      }

      componentWillMount() {
        base.listenToDoc(`${collectionPath}/testDoc1`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
        base.listenToDoc(`${collectionPath}/testDoc2`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
        base.listenToDoc(`${collectionPath}/testDoc3`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
      }

      componentWillUnmount() {
        componentWillMountSpy('additional clean up performed');
      }

      render() {
        return <div />;
      }
    }

    class ParentComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          showChild: true
        };
      }

      setData(cb) {
        Promise.all([
          collectionRef.doc('testDoc1').set(dummyCollection[0]),
          collectionRef.doc('testDoc2').set(dummyCollection[1]),
          collectionRef.doc('testDoc3').set(dummyCollection[2])
        ]).then(() => {
          setTimeout(cb, 500);
        });
      }

      componentDidMount() {
        this.setState(
          {
            showChild: false
          },
          () => {
            this.setData(() => {
              expect(console.error).not.toHaveBeenCalled();
              expect(componentWillMountSpy).toHaveBeenCalledWith(
                'additional clean up performed'
              );
              done();
            });
          }
        );
      }

      render() {
        return <div>{this.state.showChild ? <ChildComponent /> : null}</div>;
      }
    }
    ReactDOM.render(<ParentComponent />, document.getElementById('mount'));
  });
});
