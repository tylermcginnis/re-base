var Rebase = require('../../src/rebase.js');
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var database = require('firebase/database');

var invalidEndpoints = require('../fixtures/invalidEndpoints');
var dummyObjData = require('../fixtures/dummyObjData');
var invalidOptions = require('../fixtures/invalidOptions');
var firebaseConfig = require('../fixtures/config');

describe('listenTo()', function(){
  var base;
  var testEndpoint = 'test/listenTo';
  var testApp;
  var ref;
  var app;

  beforeAll(() => {
    testApp = firebase.initializeApp(firebaseConfig, 'DB_CHECK');
    ref = testApp.database().ref();
    var mountNode = document.createElement('div');
    mountNode.setAttribute("id", "mount");
    document.body.appendChild(mountNode);
  });

  afterAll(done => {
    testApp.delete().then(done);
  });

  beforeEach(() => {
    app = firebase.initializeApp(firebaseConfig);
    var db = database(app);
    base = Rebase.createClass(db);
  });

  afterEach(done => {
    ReactDOM.unmountComponentAtNode(document.body);
    firebase.Promise.all([
      app.delete(),
      ref.child(testEndpoint).set(null)
    ]).then(done);
  });

  it('listenTo() returns a valid ref', function(){
    var ref = base.listenTo(testEndpoint, {
      context: this,
      then(data){}
    });
    expect(ref.id).toEqual(jasmine.any(Number));
  })

  it('listenTo() throws an error given a invalid endpoint', function(){
    invalidEndpoints.forEach((endpoint) => {
      try {
        base.listenTo(endpoint, {
          context: this,
          then(data){
          }
        })
      } catch(err) {
        expect(err.code).toEqual('INVALID_ENDPOINT');
      }
    });
  });

  it('listenTo() throws an error given an invalid options object', function(){
    invalidOptions.forEach((option) => {
      try {
        base.listenTo(testEndpoint, option);
      } catch(err) {
        expect(err.code).toEqual('INVALID_OPTIONS');
      }
    });
  });

  describe('Async tests', function(){
    it('listenTo()\'s .then method gets invoked when the Firebase endpoint changes', function(done){
      var didUpdate = false;
      base.listenTo(testEndpoint, {
        context: {},
        then(data){
          if(didUpdate === true){
            expect(data).toEqual(dummyObjData);
            done()
          }
        }
      });
      ref.child(testEndpoint).set(dummyObjData).then(() => {
        didUpdate = true;
      });
    });

    it('listenTo\'s .then method gets invoked when the Firebase endpoint changes and correctly updates the component\'s state', function(done){
      var didUpdate = false;
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.listenTo(testEndpoint, {
            context: this,
            then(data){
              this.setState({data})
            }
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData).then(() => {
            didUpdate = true;
          });
        }
        componentDidUpdate(){
          if(didUpdate){
            expect(this.state.data).toEqual(dummyObjData);
            done();
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
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('listenTo\'s .onFailure method gets invoked with error if permissions do not allow read', function(done){
      var didUpdate = false;
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.listenTo('/readFail', {
            context: this,
            onFailure(err){
              expect(err).not.toBeUndefined();
              done();
            },
            then(data){
              done.fail('Database permissions should not allow read from this location');
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

    it('listenTo should return the data as an array if the asArray property of options is set to true', function(done){
      var didUpdate = false;
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentWillMount(){
          this.ref = base.listenTo(testEndpoint, {
            context: this,
            then(data){
              this.setState({data});
            },
            asArray: true
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData).then(() => {
            didUpdate = true;
          });
        }
        componentDidUpdate(){
          if(didUpdate){
            expect(this.state.data.indexOf(25)).not.toBe(-1);
            expect(this.state.data.indexOf('Tyler McGinnis')).not.toBe(-1);
            done();
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
      ReactDOM.render(<TestComponent />, document.getElementById('mount'));
    });

    it('listenTo should allow multiple components to listen to changes on the same endpoint', function(done){
      //set up mount points
      var div1 = document.createElement('div');
      div1.setAttribute("id", "div1");

      var div2 = document.createElement('div');
      div2.setAttribute("id", "div2");

      document.body.appendChild(div1);
      document.body.appendChild(div2);

      function cleanUp(done){
        ReactDOM.unmountComponentAtNode(document.getElementById('div1'));
        ReactDOM.unmountComponentAtNode(document.getElementById('div2'));
        done();
      }

      var component1Updated = false;
      var component2Updated = false;

      class TestComponent1 extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentDidMount(){
          this.ref = base.listenTo(testEndpoint, {
            context: this,
            then(data){
              this.setState({data});
            },
            asArray: true
          });
        }
        componentDidUpdate(){
          expect(this.state.data.indexOf(25)).not.toBe(-1);
          expect(this.state.data.indexOf('Tyler McGinnis')).not.toBe(-1);
          component1Updated = true;
          if(component1Updated && component2Updated){
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
          this.ref = base.listenTo(testEndpoint, {
            context: this,
            then(data){
              this.setState({data});
            },
            asArray: true
          });
        }
        componentDidMount(){
          ref.child(testEndpoint).set(dummyObjData)
        }
        componentDidUpdate(){
          expect(this.state.data.indexOf(25)).not.toBe(-1);
          expect(this.state.data.indexOf('Tyler McGinnis')).not.toBe(-1);
          component2Updated = true;
          if(component1Updated && component2Updated){
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
        base.listenTo(testEndpoint, {
          context: this,
          cleanUp: true,
          then(data){
            this.setState({data});
          },
          asArray: true
        });
        base.listenTo(`${testEndpoint}/secondListener`, {
          context: this,
          cleanUp: true,
          then(data){
            this.setState({data});
          },
          asArray: true
        });
        base.listenTo(`${testEndpoint}/thirdListener`, {
          context: this,
          cleanUp: true,
          then(data){
            this.setState({data});
          },
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
        Promise.all([
          base.initializedApp.database().ref().child(testEndpoint).set(dummyObjData),
          base.initializedApp.database().ref().child(`${testEndpoint}/secondListener`).set(dummyObjData),
          base.initializedApp.database().ref().child(`${testEndpoint}/thirdListener`).set(dummyObjData),
        ]).then(() => {
          setTimeout(cb, 500)
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
