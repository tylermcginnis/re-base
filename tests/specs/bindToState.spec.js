var Rebase = require('../../src/rebase.js');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase/app');
var database = require('firebase/database');

var invalidEndpoints = require('../fixtures/invalidEndpoints');
var dummyObjData = require('../fixtures/dummyObjData');
var invalidOptions = require('../fixtures/invalidOptions');
var dummyArrData = require('../fixtures/dummyArrData');
var firebaseConfig = require('../fixtures/config');


describe('bindToState()', function(){
  var base;
  var testEndpoint = 'test/bindToState';
  var testApp;
  var ref;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
    var mountNode = document.createElement('div');
    mountNode.setAttribute("id", "mount");
    document.body.appendChild(mountNode)
  });

  afterAll(done => {
    testApp.delete().then(done);
    var mountNode = document.getElementById("mount");
    mountNode.parentNode.removeChild(mountNode);
  });

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.getElementById("mount"));
    firebase.Promise.all([
      app.delete(),
      ref.child(testEndpoint).set(null)
    ]).then(done);
  });

  it('bindToState() throws an error given a invalid endpoint', function(done){
    invalidEndpoints.forEach((endpoint) => {
      try {
        base.bindToState(endpoint, {
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

  it('bindToState() throws an error given an invalid options object', function(){
    invalidOptions.forEach((option) => {
      try {
        base.bindToState('test', option);
      } catch(err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  describe('Async tests', function(){
    it('bindToState() invokes .then when the initial listener is set', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            loading: true,
          }
        }
        componentDidMount(){
          this.ref = base.bindToState(`${testEndpoint}/userData`, {
            context: this,
            state: 'user',
            then(){
              this.setState({
                loading: false
              }, () => {
                expect(this.state.loading).toEqual(false);
                done();
              });
            }
          });
        }
        render(){
          return (
            <div>
              No Data
            </div>
          );
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() invokes .onFailure with error if permissions do not allow read', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            loading: true,
            user: {}
          }
        }
        componentDidMount(){
          this.ref = base.bindToState(`/readFail`, {
            context: this,
            state: 'user',
            onFailure(err){
              expect(err).not.toBeUndefined();
              done();
            }
          });
        }
        render(){
          return (
            <div>
              No Data
            </div>
          );
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() updates its local state with an empty array and object when the Firebase endpoint is null', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            emptyObj: {},
            emptyArr: [],
            kickOffUpdate: false
          }
        }
        componentDidMount(){
          this.firstRef = base.bindToState(`${testEndpoint}/abcdefg`, {
            context: this,
            state: 'emptyObj',
          });

          this.secondRef = base.bindToState(`${testEndpoint}/hijklmnop`, {
            context: this,
            state: 'emptyArr',
            asArray: true
          });
        }
        componentDidUpdate(){
          expect(this.state.emptyObj).toEqual({});
          expect(this.state.emptyArr).toEqual([]);
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
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() updates its local state with defaultValue when the Firebase endpoint is null and defaultValue is set', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            empty: 'someValue'
          }
        }
        componentDidMount(){
          this.firstRef = base.bindToState(`${testEndpoint}/abcdefg`, {
            context: this,
            state: 'empty',
            defaultValue: 0
          });
        }
        componentDidUpdate(){
          expect(this.state.empty).toEqual(0);
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
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() properly updates the local state property when the Firebase endpoint changes', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData);
        }
        componentDidUpdate(){
          expect(this.state.data).toEqual(dummyObjData);
          done();
        }
        componentWillUnmount(){
          base.removeBinding(this.ref);
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() properly updates the local state nested property when the Firebase endpoint changes', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {
              foo: {
                bar: {}
              }
            }
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data.foo.bar',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData);
        }
        componentDidUpdate(){
          expect(this.state.data.foo.bar).toEqual(dummyObjData);
          done();
        }
        componentWillUnmount(){
          base.removeBinding(this.ref);
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() properly updates the local state nested property (with sibling) when the Firebase endpoint changes', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {
              foo: {
                a: {},
                b: 'bar'
              }
            }
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data.foo.a',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData);
        }
        componentDidUpdate(){
          expect(this.state.data.foo.a).toEqual(dummyObjData);
          expect(this.state.data.foo.b).toEqual('bar');
          done();
        }
        componentWillUnmount(){
          base.removeBinding(this.ref);
        }
        render(){
          return (
            <div>
              No Data
            </div>
          )
        }
      }
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() properly updates the local state property when the Firebase endpoint changes and asArray is true', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            friends: []
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(`${testEndpoint}/myFriends`, {
            context: this,
            state: 'friends',
            asArray: true
          });
        }
        componentDidMount(){
          ref.child(`${testEndpoint}/myFriends`).set(dummyArrData);
        }
        componentDidUpdate(){
          expect(this.state.friends).toEqual(dummyArrData);
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
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState() properly updates the local state property even when Firebase has initial date before bindToState is called', function(done){
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData);
        }
        componentDidUpdate(){
          expect(this.state.data).toEqual(dummyObjData);
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
      ReactDOM.render(<TestComponent />, document.getElementById("mount"));
    });

    it('bindToState should allow multiple components to listen to changes on the same endpoint', function(done){

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
      document.getElementById("mount").appendChild(div1);
      document.getElementById("mount").appendChild(div2);

      //keep track of updates
      var component1DidUpdate = false;
      var component2DidUpdate = false;

      class TestComponent1 extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data',
          });
        }
        componentDidUpdate(){
          expect(this.state.data).toEqual(dummyObjData);
          component1DidUpdate = true;
          if(component1DidUpdate && component2DidUpdate){
            cleanUp(done);
          }
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
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data',
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData);
        }
        componentDidUpdate(){
          expect(this.state.data).toEqual(dummyObjData);
          component2DidUpdate = true;
          if(component1DidUpdate && component2DidUpdate){
            cleanUp(done);
          }
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
  });

  it('listeners are removed when component unmounts and cleanUp option is true', function(done){
    spyOn(console, 'error');
    var componentWillMountSpy = jasmine.createSpy('componentWillMountSpy');
    class ChildComponent extends React.Component {

      constructor(props){
        super(props);
        this.state = {
          data: {}
        }
      }

      componentWillMount(){
        base.bindToState(testEndpoint, {
          context: this,
          state: 'data',
          cleanUp: true,
          asArray: true
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
        )
      }
    }

    class ParentComponent extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          showChild: true
        }
      }

      setData(cb) {
        base.initializedApp.database().ref().child(testEndpoint).set(dummyObjData).then(() => {
          setTimeout(cb, 50)
        })
      }

      componentDidMount() {
        this.setState({
          showChild: false
        }, () => {
          this.setData(() => {
            expect(console.error).not.toHaveBeenCalled();
            expect(componentWillMountSpy).toHaveBeenCalledWith('additional clean up performed');
            done();
          });
        });
      }

      render() {
        return (
          <div>
            {this.state.showChild ?
              <ChildComponent />
            : null }
          </div>
        );
      }
    }
    ReactDOM.render(<ParentComponent />, document.getElementById('mount'));
  });
});
