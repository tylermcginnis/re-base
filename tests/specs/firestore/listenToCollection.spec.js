const Rebase = require('../../../src/rebase');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('listenToCollection()', function() {
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

  function seedCollection() {
    const docs = dummyCollection.map(doc => {
      return collectionRef.add(doc);
    });
    return Promise.all(docs);
  }

  it('listenToCollection() returns a valid ref', function() {
    var ref = base.listenToCollection(`${collectionPath}`, {
      context: this,
      then(data) {}
    });
    expect(ref.id).toEqual(jasmine.any(Number));
  });

  it('listenToCollection() validates endpoints', done => {
    try {
      base.listenToCollection('collection/testDoc', {
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

  it('listenToCollection() throws an error given an invalid options object', done => {
    try {
      base.listenToCollection(`${collectionPath}`, {
        context: this
      });
    } catch (err) {
      expect(err.code).toEqual('INVALID_OPTIONS');
      done();
    }
  });

  describe('Async tests', function() {
    it("listenToCollection()'s .then method gets invoked when the document changes", done => {
      const ref = base.listenToCollection(`${collectionPath}`, {
        context: {},
        then(data) {
          if (data.length) {
            expect(data).toEqual([dummyCollection[0]]);
            base.removeBinding(ref);
            done();
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it("listenToCollection's .onFailure method gets invoked in the component context with error if permissions do not allow read", done => {
      const ref = base.listenToCollection('/readFail', {
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

    it('listenToCollection() accepts a collection reference', done => {
      const testRef = app.firestore().collection('testCollection');
      const ref = base.listenToCollection(testRef, {
        context: {},
        then(data) {
          expect(data).toEqual([dummyCollection[0]]);
          base.removeBinding(ref);
          done();
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToCollection embeds document reference if withRefs is true', done => {
      const ref = base.listenToCollection(`${collectionPath}`, {
        context: {},
        withRefs: true,
        then(data) {
          if (data.length) {
            expect(data[0].ref).toEqual(
              jasmine.any(firebase.firestore.DocumentReference)
            );
            base.removeBinding(ref);
            done();
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToCollection embeds document id if withIds is true', done => {
      const ref = base.listenToCollection(`${collectionPath}`, {
        context: {},
        withIds: true,
        then(data) {
          if (data.length) {
            expect(data[0].id).toEqual(jasmine.any(String));
            base.removeBinding(ref);
            done();
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });

    it('listenToCollection() can apply a simple query', done => {
      seedCollection().then(() => {
        class TestComponent extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              data: []
            };
          }
          componentWillMount() {
            base.listenToCollection(`${collectionPath}`, {
              context: this,
              query: ref => ref.where('name', '==', 'Document 1'),
              then(data) {
                if (data.length) {
                  expect(data.length).toEqual(1);
                  expect(data[0].name).toEqual('Document 1');
                  done();
                }
              }
            });
          }
          render() {
            return <div>No Data</div>;
          }
        }
        ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      });
    });

    it('listenToCollection() can apply a compound query', done => {
      seedCollection().then(() => {
        class TestComponent extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              data: []
            };
          }
          componentWillMount() {
            base.listenToCollection(`${collectionPath}`, {
              context: this,
              query: ref =>
                ref
                  .where('id', '<', 5)
                  .where('id', '>', 2)
                  .orderBy('id'),
              then(data) {
                expect(data.length).toEqual(2);
                expect(data[0].name).toEqual('Document 3');
                expect(data[1].name).toEqual('Document 4');
                done();
              }
            });
          }
          render() {
            return <div>No Data</div>;
          }
        }
        ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      });
    });

    it('listenToCollection should allow multiple listeners to same document', done => {
      let updateCount = 0;
      const ref1 = base.listenToCollection(`${collectionPath}`, {
        context: {},
        then(data) {
          if (data.length) {
            updateCount++;
            expect(data[0]).toEqual(dummyCollection[0]);
            base.removeBinding(ref1);
            if (updateCount === 2) {
              done();
            }
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
      const ref2 = base.listenToCollection(`${collectionPath}`, {
        context: {},
        then(data) {
          if (data.length) {
            updateCount++;
            expect(data[0]).toEqual(dummyCollection[0]);
            base.removeBinding(ref2);
            if (updateCount === 2) {
              done();
            }
          }
        }
      });
      collectionRef.doc('testDoc').set(dummyCollection[0]);
    });
  });

  it('listeners are removed when component unmounts', done => {
    spyOn(console, 'error');
    var componentWillUnmountSpy = jasmine.createSpy('componentWillMountSpy');
    class ChildComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {}
        };
      }

      componentWillMount() {
        base.listenToCollection(`${collectionPath}`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
        base.listenToCollection(`${collectionPath}`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
        base.listenToCollection(`${collectionPath}`, {
          context: this,
          then(data) {
            this.setState({ data });
          }
        });
      }

      componentWillUnmount() {
        componentWillUnmountSpy('additional clean up performed');
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
              expect(componentWillUnmountSpy).toHaveBeenCalledWith(
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
