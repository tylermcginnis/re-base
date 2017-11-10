const Rebase = require('../../../src/rebase');
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

describe('bindDoc()', function() {
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

  it('bindDoc() throws an error given a invalid endpoint', done => {
    try {
      base.bindDoc('collection', {
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
    it('bindDoc() invokes .then when the initial listener is set', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            loading: true
          };
        }
        componentDidMount() {
          this.ref = base.bindDoc(`${collectionPath}/userData`, {
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

    it('bindDoc() invokes .onFailure with error if permissions do not allow read', done => {
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
          this.ref = base.bindDoc(`/readsFail/testDoc`, {
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

    it('bindDoc() returns no data if the document does not exist', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            emptyObj: {
              value: {}
            },
            emptyArr: {
              value: []
            },
            kickOffUpdate: false
          };
        }
        componentDidMount() {
          base.bindDoc(`${collectionPath}/testDoc1`, {
            context: this,
            state: 'emptyObj'
          });

          base.bindDoc(`${collectionPath}/testDoce2`, {
            context: this,
            state: 'emptyArr',
            then() {
              this.forceUpdate();
            }
          });
        }
        componentDidUpdate() {
          expect(this.state.emptyObj.value).toEqual({});
          expect(this.state.emptyArr.value).toEqual([]);
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('bindDoc() properly updates the local state property when the document changes', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentWillMount() {
          base.bindDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'data'
          });
        }
        componentDidMount() {
          collectionRef.doc('testDoc').set(dummyObjData);
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

    it('bindDoc() accepts a document reference', done => {
      const docRef = collectionRef.doc('testDoc');
      docRef.set(dummyObjData).then(() => {
        class TestComponent extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              data: {}
            };
          }
          componentWillMount() {
            base.bindDoc(docRef, {
              context: this,
              state: 'data'
            });
          }
          componentDidMount() {
            collectionRef.doc('testDoc').set(dummyObjData);
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
    });

    it('bindDoc should allow multiple components to listen to changes on the same endpoint', done => {
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

      class TestComponent1 extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            data: {}
          };
        }
        componentWillMount() {
          base.bindDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'data'
          });
        }
        componentDidUpdate() {
          expect(this.state.data).toEqual(dummyObjData);
          component1DidUpdate = true;
          if (component1DidUpdate && component2DidUpdate) {
            cleanUp(done);
          }
        }
        render() {
          return (
            <div>
              Name: {this.state.name} <br />
              Age: {this.state.age}
            </div>
          );
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
          base.bindDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'data'
          });
        }
        componentDidMount() {
          collectionRef.doc('testDoc').set(dummyObjData);
        }
        componentDidUpdate() {
          expect(this.state.data).toEqual(dummyObjData);
          component2DidUpdate = true;
          if (component1DidUpdate && component2DidUpdate) {
            cleanUp(done);
          }
        }
        render() {
          return <div />;
        }
      }
      ReactDOM.render(<TestComponent1 />, document.getElementById('div1'));
      ReactDOM.render(<TestComponent2 />, document.getElementById('div2'));
    });

    it('bindDoc merges keys if no options.state prop is supplied', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            otherKey: ['something']
          };
        }
        componentWillMount() {
          base.bindDoc(`${collectionPath}/testDoc`, {
            context: this
          });
        }
        componentDidMount() {
          collectionRef.doc('testDoc').set(dummyObjData);
        }
        componentDidUpdate() {
          expect(this.state.name).toEqual('Tyler McGinnis');
          expect(this.state.otherKey).toEqual(['something']);
          done();
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
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
        base.bindDoc(`${collectionPath}/testDoc`, {
          context: this,
          state: 'data',
          asArray: true
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
            data: dummyObjData
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
