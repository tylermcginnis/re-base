var Rebase = require('../../dist/bundle');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');

var invalidEndpoints = require('../fixtures/invalidEndpoints');
var dummyObjData = require('../fixtures/dummyObjData');
var dummyArrayOfObjects = require('../fixtures/dummyArrayOfObjects');
var invalidOptions = require('../fixtures/invalidOptions');
var dummyArrData = require('../fixtures/dummyArrData');
var firebaseConfig = require('../fixtures/config');

describe('syncState()', function(){
  var base;
  var testEndpoint = 'test/syncState';
  var testApp;
  var ref;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
    var mountNode = document.createElement('div');
    mountNode.setAttribute("id", "mount");
    document.body.appendChild(mountNode)
  });

  afterAll(done => {
    var mountNode = document.getElementById("mount");
    mountNode.parentNode.removeChild(mountNode);
    testApp.delete().then(done);
  });

  beforeEach(() => {
    base = Rebase.createClass(firebaseConfig);
  });

  afterEach(done => {
    firebase.Promise.all([
      ref.child(testEndpoint).set(null),
      base.delete()
    ]).then(done);
  });

  it('syncState() throws an error given a invalid endpoint', function(done){
    invalidEndpoints.forEach((endpoint) => {
      try {
        base.syncState(endpoint, {
          then(data){
            done();
          }
        })
      } catch(err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
        done();
      }
    });
  });

  it('syncState() throws an error given an invalid options object', function(){
    var invalidOptions = [[], {}, {context: undefined}, {context: 'strNotObj'}, {context: window, state: undefined}, {context: window, state: function(){}}, {context: window, state: 'test', then: function(){}}];
    invalidOptions.forEach((option) => {
      try {
        base.syncState('test', option);
      } catch(err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  describe('Async tests', function(){

    it('syncState() supports syncing of multiple keys', function(done) {
      var counter = 0;
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            one: 0,
            two: 0,
            three: 0
          }
        }

        componentDidMount() {
          this.refOne = base.syncState(`${testEndpoint}/one`, {
            context: this,
            state: 'one',
            then(){
              counter++;
              this.checkDone();
            }
          });

          this.refTwo = base.syncState(`${testEndpoint}/two`, {
            context: this,
            state: 'two',
            then(){
              counter++;
              this.checkDone();
            }
          });

          this.refThree = base.syncState(`${testEndpoint}/three`, {
            context: this,
            state: 'three',
            then(){
              counter++;
              this.checkDone();
            }
          });

          this.listener1 = ref.child(`${testEndpoint}/one`).on('value', snapshot => {
            var data = snapshot.val();
            if(data){
              expect(data).toEqual(1);
              expect(this.state.one).toEqual(1);
              counter++;
              this.checkDone();
            }
          });

          this.listener2 = ref.child(`${testEndpoint}/two`).on('value', snapshot => {
            var data = snapshot.val();
            if(data){
              expect(data).toEqual(2);
              expect(this.state.two).toEqual(2);
              counter++;
              this.checkDone();
            }
          });

          this.listener3 = ref.child(`${testEndpoint}/three`).on('value', snapshot => {
            var data = snapshot.val();
            if(data){
              expect(data).toEqual(3);
              expect(this.state.three).toEqual(3);
              counter++;
              this.checkDone();
            }
          });

          this.setState({ one: 1, two: 2, three: 3 });
        }
        checkDone() {
          if(counter === 6) {
            ReactDOM.unmountComponentAtNode(document.getElementById('mount'));
            done();
          }
        }

        componentDidUpdate() {
          this.checkDone();
        }

        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() should only run synced keys through their respective update function', function(done) {
      var counter = 0;
      class TestComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            one: 0,
            two: 0,
            three: 0
          }
        }

        componentDidMount() {
          this.refOne = base.syncState(`${testEndpoint}/one`, {
            context: this,
            state: 'one',
            then(){
            }
          });

          this.refTwo = base.syncState(`${testEndpoint}/two`, {
            context: this,
            state: 'two',
            then(){
            }
          });
          this.setState({ one: 1, two: { key1: null, key2: 'value'}, three: { key1: null, key2: 'value'}});
          setTimeout(() => {
            this.checkDone();
          }, 500);
        }
        checkDone() {
            expect(this.state.one).toEqual(1);
            expect(this.state.two.key1).toBeUndefined();
            expect(this.state.three.key1).toBeNull();
            done();
        }

        componentDidUpdate() {
          this.checkDone();
        }

        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() returns an empty object when there is no Firebase data and asArray is false', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.syncState(testEndpoint, {
            context: this,
            state: 'data',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(null)
        }
        componentDidUpdate(){
          expect(this.state.data).toEqual({});
          ReactDOM.unmountComponentAtNode(document.body);
          done();
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() returns a null when there is no Firebase data and asArray is false, isNullable is true', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.syncState(testEndpoint, {
            context: this,
            state: 'data',
            isNullable: true
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(null)
        }
        componentDidUpdate(){
          expect(this.state.data).toBeNull();
          ReactDOM.unmountComponentAtNode(document.body);
          done();
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });


    it('syncState() returns an array when there is data that was previously bound to another endpoint', function(done){
      ref.child(`${testEndpoint}/child2`).set(dummyArrData).then(() => {
          class TestComponent extends React.Component{
            constructor(props){
              super(props);
              this.state = {
                data: []
              }
            }
            componentWillMount(){
              this.ref = base.syncState(`${testEndpoint}/child1`, {
                context: this,
                state: 'data',
              });
            }
            componentDidMount(){
              base.removeBinding(this.ref);
              this.nextRef = base.syncState(`${testEndpoint}/child2`, {
                context: this,
                state: 'data',
              });
            }
            componentDidUpdate(){
              expect(this.state.data).toEqual(dummyArrData);
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
            render(){
              return (
                <div>
                  No Data
                </div>
              )
            }
          }
          ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      });
    });

    it('syncState() returns an empty array when there is no Firebase data and asArray is true', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            messages: []
          }
        }
        componentWillMount(){
          this.ref = base.syncState(testEndpoint, {
            context: this,
            state: 'messages',
            asArray: true
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(null);
        }
        componentDidUpdate(){
          expect(this.state.messages).toEqual([]);
          done();
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() returns a null when there is no Firebase data and asArray is true, isNullable is true', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            messages: []
          }
        }
        componentWillMount(){
          this.ref = base.syncState(testEndpoint, {
            context: this,
            state: 'messages',
            asArray: true,
            isNullable: true
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(null);
        }
        componentDidUpdate(){
          expect(this.state.messages).toBeNull();
          done();
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() syncs its local state with Firebase', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            user: {}
          }
        }
        componentWillMount(){
          this.ref = base.syncState(`${testEndpoint}/userData`, {
            context: this,
            state: 'user',
          });
        }
        componentDidMount(){
          this.setState({
            user: {name: 'Tyler'}
          });
        }
        componentDidUpdate(){
          ref.child(`${testEndpoint}/userData`).once('value', (snapshot) => {
            var data = snapshot.val();
            expect(data).toEqual(this.state.user);
            expect(data).toEqual({name: 'Tyler'});
            ReactDOM.unmountComponentAtNode(document.body);
            done();
          });
        };
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() invokes .then with correct context when the initial listener is set', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            loading: true,
            user: {}
          }
        }
        componentDidMount(){
          var context = this;
          this.ref = base.syncState(`${testEndpoint}/userData`, {
            context: this,
            state: 'user',
            then(){
              this.setState({
                loading: false
              }, () => {
                expect(this.state.loading).toEqual(false);
                expect(this).toEqual(context);
                ReactDOM.unmountComponentAtNode(document.body);
                done();
              })
            }
          });
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState\'s .onFailure method gets invoked with error and correct context if permissions do not allow read', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            loading: true,
          }
        }
        componentDidMount(){
          var context = this;
          this.ref = base.syncState(`/readFail`, {
            context: this,
            state: 'user',
            onFailure(err){
              expect(err).not.toBeUndefined();
              expect(this).toEqual(context);
              done();
            }
          });
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState\'s .onFailure method gets invoked with error and correct context if permissions do not allow write', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            user: {}
          }
        }
        componentDidMount(){
          var context = this;
          this.ref = base.syncState(`/writeFail`, {
            context: this,
            state: 'user',
            onFailure(err){
              expect(err).not.toBeUndefined();
              expect(this).toEqual(context);
              done();
            }
          });
          this.setState({user: {name: 'Chris'}});
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() syncs its local state with Firebase as an Array', function(done){
      var setStateCalled = false;
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            friends: []
          }
        }
        componentWillMount(){
          this.ref = base.syncState(`${testEndpoint}/myFriends`, {
            context: this,
            state: 'friends',
            asArray: true,
            keepKeys: true
          });
        }
        componentDidMount(){
          this.setState({
            friends: dummyArrData
          });
        }
        componentDidUpdate(){
          ref.child(`${testEndpoint}/myFriends`).on('value', (snapshot) => {
            var data = snapshot.val();
            if(data !== null){
              expect(data).toEqual(this.state.friends);
              expect(data).toEqual(dummyArrData);
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
          });
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() functions properly with a nested object data structure', function(done){
      var nestedObj = {
        name: 'Tyler',
        age: 25,
        friends: ['Joey', 'Mikenzi', 'Jacob'],
        foo: {
          bar: 'bar',
          foobar: 'barfoo'
        }
      };
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            user: {}
          }
        }
        componentWillMount(){
          this.ref = base.syncState(`${testEndpoint}/userData`, {
            context: this,
            state: 'user',
          });
        }
        componentDidMount(){
          this.setState({
            user: nestedObj
          });
        }
        componentDidUpdate(){
          ref.child(`${testEndpoint}/userData`).on('value', (snapshot) => {
            var data = snapshot.val();
            if(data !== null){
              expect(data).toEqual(this.state.user);
              expect(data).toEqual(nestedObj);
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
          });
        };
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() correctly retrieves Firebase data when given query options', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            users: [],
            hasUpdated: false
          }
        }
        componentWillMount(){
          this.ref = base.syncState(`${testEndpoint}/users`, {
            context: this,
            state: 'users',
            asArray: true,
            queries: {
              orderByChild: 'iq',
              limitToLast: 3
            }
          })
        }
        componentDidMount(){
          this.setState({
            users: [{
              name: 'Al',
              iq: 165
            }, {
              name: 'Steve',
              iq: 105
            }, {
              name: 'Pat',
              iq: 179
            }, {
              name: 'Mary',
              iq: 169
            }, {
              name: 'Jill',
              iq: 105
            }, {
              name: 'Ross',
              iq: 145
            }]
          })
        }
        componentDidUpdate(){
          if(!this.state.hasUpdated) this.setState({ hasUpdated: true });
          if(this.state.hasUpdated){
            var expectedOutput = [{
              name: 'Al',
              iq: 165
            }, {
              name: 'Mary',
              iq: 169
            }, {
              name: 'Pat',
              iq: 179
            }];

            expect(this.state.users.length).toEqual(3);
            expectedOutput.forEach((user, index) => {
              expect(this.state.users[index].name).toEqual(user.name);
            });
            ReactDOM.unmountComponentAtNode(document.body);
            done();
          }
        }
        render(){
          return <div>IQ</div>
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('syncState() keeps generated keys when asArray and keepKeys options are true', function(done){
      //set up
      firebase.Promise.all(dummyArrayOfObjects.map(item => {
        return ref.child(`${testEndpoint}/users`).push(Object.assign(item, {timestamp: base.database.ServerValue.TIMESTAMP}));
      })).then(() => {
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              users: [],
              hasUpdated: false
            }
          }
          componentWillMount(){
            this.ref = base.syncState(`${testEndpoint}/users`, {
              context: this,
              state: 'users',
              asArray: true,
              keepKeys: true
            })
          }
          componentDidUpdate(){

            if(!this.state.hasUpdated){
              var newArr = [].concat(this.state.users.slice(0,1));
              this.setState({
                users: newArr,
                hasUpdated: true,
                keyToVerify: newArr[0].key
              });
            } else {
              expect(this.state.users[0].key).toEqual(this.state.keyToVerify);
              expect(this.state.users[0].timestamp).toEqual(jasmine.any(Number));
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
          }
          render(){
            return <div>IQ</div>
          }
        }
        ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      }).catch(err => {
        done.fail(err);
      });
    });

    it('syncState() will not attempt to keep keys if the objects in the array do not have a key property when asArray and keepKeys options are true', function(done){
      //set up
      ref.child(`${testEndpoint}/users`).set(dummyArrData).then(() => {
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              users: [],
              hasUpdated: false
            }
          }
          componentWillMount(){
            this.ref = base.syncState(`${testEndpoint}/users`, {
              context: this,
              state: 'users',
              asArray: true
            })
          }
          componentDidUpdate(){
            if(!this.state.hasUpdated){
              var newArr = [].concat(this.state.users.slice(0,1));
              this.setState({
                users: newArr,
                hasUpdated: true
              });
            } else {
              expect(this.state.users[0].key).toBeUndefined();
              ReactDOM.unmountComponentAtNode(document.body);
              done();
            }
          }
          render(){
            return <div>IQ</div>
          }
        }
        ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      }).catch(err => {
        done.fail(err);
      });
    });

  it('syncState() syncs and converts server timestamps in an array', function(done){
    class TestComponent extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          users: [],
          hasUpdated: false
        }
      }
      componentWillMount(){
        this.ref = base.syncState(`${testEndpoint}/users`, {
          context: this,
          state: 'users'
        })
      }
      componentDidMount(){
        this.setState({
          users: [{
            name: 'Al',
            timestamp: base.database.ServerValue.TIMESTAMP
          }]
        })
      }
      componentDidUpdate(){
        if(!this.state.hasUpdated) this.setState({ hasUpdated: true });
        if(this.state.hasUpdated){
          expect(this.state.users[0].timestamp).toEqual(jasmine.any(Number));
          ReactDOM.unmountComponentAtNode(document.body);
          done();
        }
      }
      render(){
        return <div>IQ</div>
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });

  it('syncState() syncs and converts server timestamps in a nested data structure', function(done){
    class TestComponent extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          user: [],
          hasUpdated: false
        }
      }
      componentWillMount(){
        this.ref = base.syncState(`${testEndpoint}/user`, {
          context: this,
          state: 'user'
        })
      }
      componentDidMount(){
        this.setState({
          user: {
            name: 'Al',
            timestamp: base.database.ServerValue.TIMESTAMP
          }
        });
      }
      componentDidUpdate(){
        if(!this.state.hasUpdated) this.setState({ hasUpdated: true });
        if(this.state.hasUpdated){
          expect(this.state.user.timestamp).toEqual(jasmine.any(Number));
          ReactDOM.unmountComponentAtNode(document.body);
          done();
        }
      }
      render(){
        return <div>IQ</div>
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById('mount'));
  });

  it('syncState should allow multiple components to sync changes to the same endpoint', function(done){

    function cleanUp(done){
      ReactDOM.unmountComponentAtNode(document.getElementById('div1'));
      ReactDOM.unmountComponentAtNode(document.getElementById('div2'));
      done();
    }

    //set up mount points
    var div1 = document.createElement('div');
    div1.setAttribute("id", "div1");

    var div2 = document.createElement('div');
    div2.setAttribute("id", "div2");
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    var component1DidUpdate = false;
    var component2DidUpdate = false;

    class TestComponent1 extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          friends: []
        }
      }
      componentDidMount(){
        this.ref = base.syncState(`${testEndpoint}/myFriends`, {
          context: this,
          state: 'friends',
          asArray: true
        });
        this.setState({
          friends: dummyArrData
        });
      }
      componentDidUpdate(){
        ref.child(`${testEndpoint}/myFriends`).on('value', (snapshot) => {
          var data = snapshot.val();
          if(data){
            expect(data).toEqual(this.state.friends);
            expect(data).toEqual(dummyArrData);
            component1DidUpdate = true;
            if(component1DidUpdate && component2DidUpdate){
              cleanUp(done);
            }
          }
        });
      }
      render(){
        return (
          <div>
            Name: {this.state.name} <br />
            Age: {this.state.age}
          </div>
        )
      }
    }
    class TestComponent2 extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          friends: []
        }
      }
      componentDidMount(){
        this.ref = base.syncState(`${testEndpoint}/myFriends`, {
            context: this,
            state: 'friends',
            asArray: true
        });
        this.setState({
          friends: dummyArrData
        });
      }
      componentDidUpdate(){
        ref.child(`${testEndpoint}/myFriends`).on('value', (snapshot) => {
          var data = snapshot.val();
          if(data){
            expect(data).toEqual(this.state.friends);
            expect(data).toEqual(dummyArrData);
            component2DidUpdate = true;
            if(component1DidUpdate && component2DidUpdate){
              cleanUp(done);
            }
          }
        });
      }
      render(){
        return (
          <div>
            Name: {this.state.name} <br />
            Age: {this.state.age}
          </div>
        )
      }
    }
    ReactDOM.render(<TestComponent1 />, document.getElementById('div1'));
    ReactDOM.render(<TestComponent2 />, document.getElementById('div2'));
  });

    it('syncState should not call unbound sync listeners after removeBinding called', function(done){

        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              friends: []
            }
          }
          componentDidMount(){
            this.ref = base.syncState(`${testEndpoint}/myFriends`, {
              context: this,
              state: 'friends',
              asArray: true
            });
            this.otherRef = base.syncState(`${testEndpoint}/myOtherFriends`, {
              context: this,
              state: 'friends',
              asArray: true
            });
            base.removeBinding(this.ref);
            this.setState({
               friends: dummyArrData
            });
          }
          componentDidUpdate(){
            ref.child(`${testEndpoint}/myOtherFriends`).on('value', (snapshot) => {
              var data = snapshot.val();
              if(data){
                expect(data).toEqual(dummyArrData);
                ref.child(`${testEndpoint}/myFriends`).on('value', (snapshot) => {
                  var data1 = snapshot.val();
                  expect(data1).toEqual(null);
                  done();
                });
              }
            });
          }
          render(){
            return (
              <div>
                Name: {this.state.name} <br />
                Age: {this.state.age}
              </div>
            )
          }
        }
        ReactDOM.render(<TestComponent />, document.getElementById('mount'));
      });

      it('syncState should reset setState after all listeners are unbound', function(done){

          class TestComponent extends React.Component{
            constructor(props){
              super(props);
              this.state = {
                friends: []
              }
            }
            componentDidMount(){
              this.ref = base.syncState(`${testEndpoint}/myFriends`, {
                context: this,
                state: 'friends',
                asArray: true
              });
              base.removeBinding(this.ref);
              this.setState({
                friends: ['Chris']
              });

            }
            componentDidUpdate(){
              expect(this.state.friends).toEqual(['Chris']);
              done();
            }
            render(){
              return (
                <div>
                  Name: {this.state.name} <br />
                  Age: {this.state.age}
                </div>
              )
            }
          }
          ReactDOM.render(<TestComponent />, document.getElementById('mount'));
        });
  });
});
