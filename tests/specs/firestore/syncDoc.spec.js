const Rebase = require('../../../dist/bundle');
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

describe('syncDoc()', function() {
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

  it('syncDoc() validates document paths', done => {
    try {
      base.syncDoc('collection', {
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

  it('syncDoc() throws an error when context is missing from options', function() {
    var invalidOptions = [
      [],
      {},
      { context: undefined },
      { context: 'strNotObj' },
      { context: window }
    ];
    invalidOptions.forEach(option => {
      try {
        base.syncDoc('testCollection/testDoc', option);
      } catch (err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  it('syncDoc() throws an error when state is missing from options', function() {
    var invalidOptions = [
      [],
      {},
      { context: { setState: () => {} } },
      { context: { setState: () => {} }, state: null },
      { context: { setState: () => {} }, state: {} }
    ];
    invalidOptions.forEach(option => {
      try {
        base.syncDoc('testCollection/testDoc', option);
      } catch (err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  describe('Async tests', function() {
    it('syncDoc() supports syncing of multiple keys', done => {
      var counter = 0;
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            one: {},
            two: {},
            three: {}
          };
        }

        componentDidMount() {
          base.syncDoc(`${collectionPath}/docOne`, {
            context: this,
            state: 'one',
            then() {
              counter++;
              this.checkDone();
            }
          });

          base.syncDoc(`${collectionPath}/docTwo`, {
            context: this,
            state: 'two',
            then() {
              counter++;
              this.checkDone();
            }
          });

          base.syncDoc(`${collectionPath}/docThree`, {
            context: this,
            state: 'three',
            then() {
              counter++;
              this.checkDone();
            }
          });

          this.unsubscribe1 = collectionRef
            .doc(`docOne`)
            .onSnapshot(snapshot => {
              if (snapshot.exists) {
                expect(snapshot.data()).toEqual({ name: 'Doc 1' });
                expect(this.state.one).toEqual({ name: 'Doc 1' });
                counter++;
                this.checkDone();
              }
            });

          this.unsubscribe2 = collectionRef
            .doc(`docTwo`)
            .onSnapshot(snapshot => {
              if (snapshot.exists) {
                expect(snapshot.data()).toEqual({ name: 'Doc 2' });
                expect(this.state.two).toEqual({ name: 'Doc 2' });
                counter++;
                this.checkDone();
              }
            });

          this.unsubscribe3 = collectionRef
            .doc(`docThree`)
            .onSnapshot(snapshot => {
              if (snapshot.exists) {
                expect(snapshot.data()).toEqual({ name: 'Doc 3' });
                expect(this.state.three).toEqual({ name: 'Doc 3' });
                counter++;
                this.checkDone();
              }
            });

          this.setState({
            one: {
              name: 'Doc 1'
            },
            two: {
              name: 'Doc 2'
            },
            three: {
              name: 'Doc 3'
            }
          });
        }
        checkDone() {
          if (counter === 6) {
            this.unsubscribe1();
            this.unsubscribe2();
            this.unsubscribe3();
            ReactDOM.unmountComponentAtNode(document.getElementById('mount'));
            done();
          }
        }

        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncDoc() should only run synced keys through their respective update function', done => {
      var counter = 0;
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            one: 0,
            two: 0,
            three: 0
          };
        }

        componentDidMount() {
          base.syncDoc(`${collectionPath}/one`, {
            context: this,
            state: 'one'
          });

          base.syncDoc(`${collectionPath}/two`, {
            context: this,
            state: 'two'
          });
          this.setState({
            one: { key1: 'one', key2: 'value' },
            two: { key1: 'two', key2: 'value' },
            three: {
              key1: 'three',
              key2: firebase.firestore.FieldValue.serverTimestamp
            }
          });
          setTimeout(() => {
            this.checkDone();
          }, 300);
        }

        checkDone() {
          expect(this.state.one).toEqual({
            key1: 'one',
            key2: 'value'
          });
          expect(this.state.two).toEqual({
            key1: 'two',
            key2: 'value'
          });
          expect(this.state.three).toEqual({
            key1: 'three',
            key2: firebase.firestore.FieldValue.serverTimestamp
          });
          done();
        }

        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncDoc() synced documents can be swapped out during lifecycle', done => {
      collectionRef
        .doc('child2')
        .set(dummyObjData)
        .then(() => {
          class TestComponent extends React.Component {
            constructor(props) {
              super(props);
              this.state = {
                data: []
              };
            }
            componentWillMount() {
              this.ref = base.syncDoc(`${collectionPath}/child1`, {
                context: this,
                state: 'data'
              });
            }
            componentDidMount() {
              base.removeBinding(this.ref);
              base.syncDoc(`${collectionPath}/child2`, {
                context: this,
                state: 'data'
              });
            }
            componentDidUpdate() {
              expect(this.state.data).toEqual(dummyObjData);
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
            render() {
              return <div>No Data</div>;
            }
          }
          ReactDOM.render(<TestComponent />, document.getElementById('mount'));
        });
    });

    it('syncDoc() syncs its local state with Firestore', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            user: {}
          };
        }
        componentWillMount() {
          base.syncDoc(`${collectionPath}/userData`, {
            context: this,
            state: 'user'
          });
        }
        componentDidMount() {
          this.setState({
            user: { name: 'Tyler' }
          });
        }

        componentDidUpdate() {
          const unsubscribe = collectionRef.doc('userData').onSnapshot(doc => {
            if (doc.exists) {
              const data = doc.data();
              expect(data).toEqual(this.state.user);
              expect(data).toEqual({ name: 'Tyler' });
              ReactDOM.unmountComponentAtNode(document.body);
              unsubscribe();
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

    it('syncDoc invokes .then with correct context when the initial listener is set', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            loading: true,
            user: {}
          };
        }
        componentDidMount() {
          var context = this;
          base.syncDoc(`${collectionPath}/userData`, {
            context: this,
            state: 'user',
            then() {
              this.setState(
                {
                  loading: false
                },
                () => {
                  expect(this.state.loading).toEqual(false);
                  expect(this).toEqual(context);
                  ReactDOM.unmountComponentAtNode(document.body);
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

    it('syncDoc functions properly with a nested object data structure', done => {
      var nestedObj = {
        name: 'Tyler',
        age: 25,
        friends: ['Joey', 'Mikenzi', 'Jacob'],
        foo: {
          bar: 'bar',
          foobar: 'barfoo'
        }
      };
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            user: {}
          };
        }
        componentWillMount() {
          this.ref = base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'user'
          });
        }
        componentDidMount() {
          this.setState({
            user: nestedObj
          });
        }
        componentDidUpdate() {
          const unsubscribe = collectionRef.doc('testDoc').onSnapshot(doc => {
            if (doc.exists) {
              const data = doc.data();
              expect(data).toEqual(this.state.user);
              expect(data).toEqual(nestedObj);
              ReactDOM.unmountComponentAtNode(document.body);
              unsubscribe();
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

    it('syncDoc syncs and converts server timestamps', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            user: {}
          };
        }
        componentDidMount() {
          base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'user'
          });
          this.setState({
            user: {
              name: 'Al',
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
          });
        }
        componentWillUpdate(nextProps, nextState) {
          if (nextState.user.timestamp) {
            expect(this.state.user.timestamp).toEqual(jasmine.any(Date));
            ReactDOM.unmountComponentAtNode(document.body);
            done();
          }
        }
        render() {
          return <div>IQ</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncDoc syncs and converts server timestamps in a nested data structure', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            user: []
          };
        }
        componentWillMount() {
          base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'user'
          });
        }
        componentDidMount() {
          this.setState({
            user: {
              name: 'Al',
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
          });
        }
        componentWillUpdate(nextProps, nextState) {
          if (this.state.user.timestamp) {
            expect(this.state.user.timestamp).toEqual(jasmine.any(Date));
            ReactDOM.unmountComponentAtNode(document.body);
            done();
          }
        }
        render() {
          return <div>IQ</div>;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncDoc should allow multiple components to sync changes to the same endpoint', done => {
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
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      var component1DidUpdate = false;
      var component2DidUpdate = false;

      class TestComponent1 extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            doc: {
              friends: []
            }
          };
        }
        componentDidMount() {
          this.ref = base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'doc'
          });
          this.setState({
            doc: {
              friends: dummyArrData
            }
          });
        }
        componentDidUpdate() {
          const unsubscribe = collectionRef.doc('testDoc').onSnapshot(doc => {
            if (doc.exists) {
              var data = doc.data();
              expect(data).toEqual(this.state.doc);
              expect(data.friends).toEqual(dummyArrData);
              component1DidUpdate = true;
              if (component1DidUpdate && component2DidUpdate) {
                cleanUp(done);
              }
              unsubscribe();
            }
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      class TestComponent2 extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            friends: []
          };
        }
        componentDidMount() {
          base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'friends'
          });
          this.setState({
            doc: {
              friends: dummyArrData
            }
          });
        }
        componentDidUpdate() {
          const unsubscribe = collectionRef.doc('testDoc').onSnapshot(doc => {
            if (doc.exists) {
              var data = doc.data();
              expect(data).toEqual(this.state.doc);
              expect(data.friends).toEqual(dummyArrData);
              component2DidUpdate = true;
              if (component1DidUpdate && component2DidUpdate) {
                cleanUp(done);
              }
              unsubscribe();
            }
          });
        }
        render() {
          return <div>No Data</div>;
        }
      }
      ReactDOM.render(<TestComponent1 />, document.getElementById('div1'));
      ReactDOM.render(<TestComponent2 />, document.getElementById('div2'));
    });

    it('syncDoc should not call unbound sync listeners after removeBinding called', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            doc: {
              friends: []
            }
          };
        }
        componentDidMount() {
          this.ref = base.syncDoc(`${collectionPath}/testDoc1`, {
            context: this,
            state: 'doc'
          });
          this.otherRef = base.syncDoc(`${collectionPath}/testDoc2`, {
            context: this,
            state: 'doc'
          });
          base.removeBinding(this.ref);
          this.setState({
            doc: {
              friends: dummyArrData
            }
          });
        }
        componentDidUpdate() {
          const unsubscribe = collectionRef.doc('testDoc2').onSnapshot(doc2 => {
            if (doc2.exists) {
              expect(doc2.data().friends).toEqual(dummyArrData);
              const unsubscribe2 = collectionRef
                .doc('testDoc1')
                .onSnapshot(doc1 => {
                  expect(doc1.exists).toBe(false);
                  unsubscribe();
                  unsubscribe2();
                  done();
                });
            }
          });
        }
        render() {
          return <div />;
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncDoc should reset setState after all listeners are unbound', done => {
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            friends: []
          };
        }
        componentDidMount() {
          this.ref = base.syncDoc(`${collectionPath}/testDoc`, {
            context: this,
            state: 'friends',
            asArray: true
          });
          base.removeBinding(this.ref);
          this.setState({
            friends: {
              list: ['Chris']
            }
          });
        }
        componentDidUpdate() {
          expect(this.state.friends.list).toEqual(['Chris']);
          done();
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
        base.syncDoc(`${collectionPath}/testDoc`, {
          context: this,
          state: 'data'
        });
      }

      componentWillUnmount() {
        componentWillMountSpy('additional clean up performed');
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

    class ParentComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          showChild: true
        };
      }

      setData(cb) {
        this.setState(
          {
            data: dummyObjData
          },
          () => {
            setTimeout(cb, 50);
          }
        );
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

  it('setState callback is called', done => {
    var callbackSpy = jasmine.createSpy('cb');
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            count: 6
          }
        };
      }

      componentWillMount() {
        base.syncDoc(`${collectionPath}/testDoc`, {
          context: this,
          state: 'data'
        });
      }

      componentDidMount() {
        this.setState(
          {
            data: {
              count: 6
            }
          },
          callbackSpy
        );
      }

      componentDidUpdate() {
        setTimeout(() => {
          expect(callbackSpy).toHaveBeenCalled();
          done();
        }, 200);
      }

      render() {
        return <div>{this.state.data.count}</div>;
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });

  it('syncs correctly when setState argument is a function', done => {
    class TestComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          data: {
            count: 5
          }
        };
      }

      componentWillMount() {
        base.syncDoc(`${collectionPath}/testDoc`, {
          context: this,
          state: 'data'
        });
      }

      componentDidMount() {
        this.setState(
          prevState => ({
            data: {
              count: prevState.data.count + 1
            }
          }),
          () => {
            expect(this.state.data.count).toEqual(6);
            setTimeout(() => {
              collectionRef
                .doc('testDoc')
                .get()
                .then(doc => {
                  var data = doc.data();
                  expect(data.count).toEqual(6);
                  done();
                });
            }, 1000);
          }
        );
      }

      render() {
        return <div>{this.state.data.count}</div>;
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });
});
