const Rebase = require('../../../dist/bundle');
const React = require('react');
const ReactDOM = require('react-dom');
const firebase = require('firebase');
require('firebase/firestore');

var dummyCollection = require('../../fixtures/dummyCollection');
var firebaseConfig = require('../../fixtures/config');

describe('bindCollection()', function() {
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

  it('bindCollection() throws an error given a invalid endpoint', done => {
    try {
      base.bindCollection('testCollection/testDoc', {
        context: { setState: () => {} },
        state: 'prop',
        then() {
          done.fail('error should have been thrown');
        }
      });
    } catch (err) {
      expect(err).not.toBe(null);
      done();
    }
  });

  describe('Async tests', function() {
    it('bindCollection() invokes .then when the initial listener is set', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            loading: true
          };
        }
        componentDidMount() {
          this.ref = base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'user',
            then() {
              this.setState(
                {
                  loading: false
                },
                () => {
                  expect(this.state.loading).toEqual(false);
                  done();
                }
              );
            }
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() invokes .onFailure with error if permissions do not allow read', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            loading: true,
            user: {}
          };
        }
        componentDidMount() {
          var self = this;
          this.ref = base.bindCollection(`/readsFail`, {
            context: this,
            state: 'user',
            onFailure(err) {
              expect(this).toEqual(self);
              expect(this.setState).toEqual(self.setState);
              expect(err).not.toBeUndefined();
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

    it('bindCollection() returns no data if the collection does not exist', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            emptyObj: {
              value: {}
            },
            kickOffUpdate: false
          };
        }
        componentDidMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'emptyObj',
            then() {
              this.forceUpdate();
            }
          });
        }
        componentDidUpdate() {
          expect(this.state.emptyObj.value).toEqual({});
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() properly updates the local state property when the collection changes', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: []
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data'
          });
        }
        componentDidMount() {
          seedCollection().then(() => {
            setTimeout(() => {
              expect(this.state.data.length).toEqual(5);
              done();
            }, 500);
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() returns documents with embedded refrence if options.withRefs is true', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data',
            withRefs: true
          });
        }
        componentDidMount() {
          collectionRef.doc('testDoc').set(dummyCollection[0]);
        }
        componentDidUpdate() {
          expect(this.state.data[0].ref).toEqual(
            jasmine.any(firebase.firestore.DocumentReference)
          );
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() returns documents with Firestore id embedded if options.withIds is true', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data',
            withIds: true
          });
        }
        componentDidMount() {
          collectionRef.doc('testDoc').set(dummyCollection[0]);
        }
        componentDidUpdate() {
          expect(this.state.data[0].id).toEqual(jasmine.any(String));
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() can apply a simple query', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: []
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data',
            query: ref => ref.where('name', '==', 'Document 1')
          });
        }
        componentDidMount() {
          seedCollection().then(() => {
            setTimeout(() => {
              expect(this.state.data.length).toEqual(1);
              expect(this.state.data[0].name).toEqual('Document 1');
              done();
            }, 500);
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection() can apply a compound query', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: []
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data',
            query: ref =>
              ref
                .where('id', '<', 5)
                .where('id', '>', 2)
                .orderBy('id')
          });
        }
        componentDidMount() {
          seedCollection().then(() => {
            setTimeout(() => {
              expect(this.state.data.length).toEqual(2);
              expect(this.state.data[0].name).toEqual('Document 3');
              expect(this.state.data[1].name).toEqual('Document 4');
              done();
            }, 500);
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindCollection should allow multiple components to listen to changes on the same endpoint', done => {
      function cleanUp(done) {
        ReactDOM.unmountComponentAtNode(document.getElementById('div1'));
        ReactDOM.unmountComponentAtNode(document.getElementById('div2'));
        done();
      }
      //set up mount points
      var div1 = document.createElement('div');
      div1.setAttribute('id', 'div1');

      var div2 = document.createElement('div');
      div2.setAttribute('id', 'div2');
      document.getElementById('mount').appendChild(div1);
      document.getElementById('mount').appendChild(div2);

      //keep track of updates
      var component1DidUpdate = false;
      var component2DidUpdate = false;
      var arrayLength = 0;

      class TestComponent1 extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: []
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data'
          });
        }

        componentDidUpdate() {
          component1DidUpdate = true;
          expect(arrayLength).toBeLessThan(this.state.data.length);
          arrayLength = this.state.data.length;
          if (component1DidUpdate && component2DidUpdate) {
            cleanUp(done);
          }
        }
        render() {
          return <div />;
        }
      }

      class TestComponent2 extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentWillMount() {
          base.bindCollection(`${collectionPath}`, {
            context: this,
            state: 'data'
          });
        }
        componentDidMount() {
          seedCollection().then(() => {
            setTimeout(() => {
              expect(this.state.data.length).toEqual(5);
              component2DidUpdate = true;
              if (component1DidUpdate && component2DidUpdate) {
                cleanUp(done);
              }
            }, 200);
          });
        }
        render() {
          return <div />;
        }
      }
      ReactDOM.render(<TestComponent1 />, document.getElementById('div1'));
      ReactDOM.render(<TestComponent2 />, document.getElementById('div2'));
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
        base.bindCollection(`${collectionPath}`, {
          context: this,
          state: 'data'
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
        collectionRef
          .doc('testDoc')
          .set({
            data: dummyCollection[0]
          })
          .then(cb);
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
