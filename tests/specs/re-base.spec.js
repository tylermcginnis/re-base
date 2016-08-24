var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyBm3py9af9BqQMfUMnMKpAXJUfxlsegnDI",
    authDomain: "qwales1-test.firebaseapp.com",
    databaseURL: "https://qwales1-test.firebaseio.com",
    storageBucket: "qwales1-test.appspot.com"
};
var testApp = firebase.initializeApp(firebaseConfig, 'TEST_APP');
var ref = testApp.database().ref();

var invalidFirebaseURLs = [null, undefined, true, false, [], 0, 5, "", "a", ["hi", 1]];
var invalidEndpoints = ['', 'ab.cd', 'ab#cd', 'ab$cd', 'ab[cd', 'ab]cd'];
var dummyObjData = {name: 'Tyler McGinnis', age: 25};
var dummyNestedObjData = {about: {name: 'Tyler', age: 25}, friends: {jacob: {name: 'Jacob Turner', age: 23}}};
var nestedObjArrResult = [{age: 25, key: 'about', name: 'Tyler'}, {key: 'friends', jacob: {age: 23, name: 'Jacob Turner'}}];
var dummyArrData = ['Tyler McGinnis', 'Jacob Turner', 'Ean Platter'];
var testEndpoint = 'test/child';
var dummyUsers = {
  'unknown': {email: 'unknown@thisdomainisfake.com', password: 'nonono'},
  'known': {email: 'fakeymcfakefake@chriswal.es', password: '123456password'},
  'invalid': {email: 'invalid@com', password: 'correcthorsebatterystaple'},
  'toDelete': {email: 'test@example.com', password: 'correcthorsebatterystaple', newPassword: 'chipsahoy'},
};
var base;

describe('re-base Tests:', function(){
  beforeEach(function(done){
    base = Rebase.createClass(firebaseConfig);
    ref.remove(err => {
        if(err) done(err);
        ref = firebase.database().ref();
        done();
    });
  });

  afterEach(function(done){
    React.unmountComponentAtNode(document.body);
    base.reset();
    base = null;
    done();
  });

  describe('createClass()', function(){

    it('createClass() returns an object with the correct API', function(){
      expect(base.listenTo).toBeDefined();
      expect(base.bindToState).toBeDefined();
      expect(base.syncState).toBeDefined();
      expect(base.fetch).toBeDefined();
      expect(base.post).toBeDefined();
      expect(base.removeBinding).toBeDefined();
      expect(base.listenTo).toEqual(jasmine.any(Function));
      expect(base.bindToState).toEqual(jasmine.any(Function));
      expect(base.syncState).toEqual(jasmine.any(Function));
      expect(base.fetch).toEqual(jasmine.any(Function));
      expect(base.post).toEqual(jasmine.any(Function));
      expect(base.removeBinding).toEqual(jasmine.any(Function));
      expect(base.storage).toEqual(jasmine.any(Function));
      expect(base.app).toEqual(jasmine.any(Function));
      expect(base.database).toEqual(jasmine.any(Function));
      expect(base.auth).toEqual(jasmine.any(Function));
    });
    it('createClass() returns a singleton if it\'s already been invoked', function(){
      var newBase = Rebase.createClass(firebaseConfig);
      expect(base).toEqual(newBase);
    });
  });
  
  describe('post()', function(){
    it('post() throws an error given a invalid endpoint', function(){
      invalidEndpoints.forEach((endpoint) => {
        try {
          base.post(endpoint, {
            data: dummyObjData
          })
        } catch(err) {
          expect(err.code).toEqual('INVALID_ENDPOINT');
        }
      });
    });

    it('post() throws an error given an invalid options object', function(){
      var invalidOptions = [[], {}, {then: function(){}}, {data: undefined}];
      invalidOptions.forEach((option) => {
        try {
          base.post(testEndpoint, option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
    });

    it('post() updates Firebase correctly', function(done){
      base.post(testEndpoint, {
        data: dummyObjData,
        then(){
          ref.child(testEndpoint).once('value', (snapshot) => {
            var data = snapshot.val();
            expect(data).toEqual(dummyObjData);
            done();
          });
        }
      })
    });
  });


  describe('push()', function(){
    it('push() throws an error given a invalid endpoint', function(){
      invalidEndpoints.forEach((endpoint) => {
        try {
          base.push(endpoint, {
            data: dummyObjData
          })
        } catch(err) {
          expect(err.code).toEqual('INVALID_ENDPOINT');
        }
      });
    });

    it('push() throws an error given an invalid options object', function(){
      var invalidOptions = [[], {}, {then: function(){}}, {data: undefined}];
      invalidOptions.forEach((option) => {
        try {
          base.push(testEndpoint, option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
    });

    it('push() returns a Firebase reference for the generated location', function(){
      var returnedEndpoint = base.push(testEndpoint, {
        data: dummyObjData
      });
      var endpointString = returnedEndpoint.toString();
      var endpointBaseUrl = endpointString.substr(0, firebaseConfig.databaseURL.length);
      expect(endpointBaseUrl).toEqual(firebaseConfig.databaseURL);
    });

    it('push() updates Firebase correctly', function(done){
      base.push(testEndpoint, {
        data: dummyObjData,
        then(){
          ref.child(testEndpoint).once('value', (snapshot) => {
            var keyedData = snapshot.val();
            var data = keyedData[Object.keys(keyedData)[0]];
            expect(data).toEqual(dummyObjData);
            done();
          });
        }
      })
    });
  });

  describe('fetch()', function(){
    it('fetch() throws an error given a invalid endpoint', function(){
      invalidEndpoints.forEach((endpoint) => {
        try {
          base.fetch(endpoint, {
            then(data){
              done();
            }
          })
        } catch(err) {
          expect(err.code).toEqual('INVALID_ENDPOINT');
        }
      });
    });

    it('fetch() throws an error given an invalid options object', function(){
      var invalidOptions = [[], {}, {then: undefined}, {then: 'strNotFn'}, {then: function(){}}, {onConnectionLoss: 'strNotFn'}];
      invalidOptions.forEach((option) => {
        try {
          base.fetch('test', option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
    });

    describe('Async tests', function(){
      beforeEach((done) => {
        ref.child(testEndpoint).set(dummyObjData, () => {
          done();
        });
      });

      it('fetch()\'s .then gets invoked with the data from Firebase once the data is retrieved', function(done){
        base.fetch(testEndpoint, {
          context: {},
          then(data){
            expect(data).toEqual(dummyObjData);
            done();
          }
        });
      });

      it('fetch()\'s asArray property should return the data from Firebase as an array', function(done){
        base.fetch(testEndpoint, {
          asArray: true,
          context: {},
          then(data){
            expect(data.indexOf('Tyler McGinnis')).not.toBe(-1);
            expect(data.indexOf(25)).not.toBe(-1);
            done();
          }
        });
      });

      it('fetch()\'s asArray property should add a key property on nested objects', function(done){
        ref.child(testEndpoint).set(dummyNestedObjData, () => {
          base.fetch(testEndpoint, {
            asArray: true,
            context: {},
            then(data){
              expect(data).toEqual(nestedObjArrResult);
              done();
            }
          })
        });
      });

      it('fetch() correctly updates the state of the component with data from fetch', function(done){
        ref.child(testEndpoint).set(dummyObjData);
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              data: {}
            }
          }
          componentDidMount(){
            base.fetch(testEndpoint, {
              context: this,
              then(data){
                this.setState({data})
              }
            });
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
        React.render(<TestComponent />, document.body);
      });

      it('fetch() correctly updates the state of the component with data from fetch and asArray set to true', function(done){
        ref.child(testEndpoint).set(dummyArrData);
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              friends: []
            }
          }
          componentDidMount(){
            base.fetch(testEndpoint, {
              context: this,
              asArray: true,
              then(friends){
                this.setState({friends})
              }
            });
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
        React.render(<TestComponent />, document.body);
      });
    });
  });

  describe('listenTo()', function(){

    it('listenTo() returns a valid ref', function(){
      var ref = base.listenTo(testEndpoint, {
        context: this,
        then(data){

        }
      });
      expect(ref).toEqual({ endpoint: testEndpoint, method: 'listenTo' });
    })

    it('listenTo() throws an error given a invalid endpoint', function(done){
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
      done();
    });

    it('listenTo() throws an error given an invalid options object', function(done){
      var invalidOptions = [[], {}, {then: function(){}}, {context: undefined}, {context: 'strNotObj'}, {context: window, then: undefined}, {context: window, then: 'strNotFn'}];
      invalidOptions.forEach((option) => {
        try {
          base.listenTo(testEndpoint, option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
      done();
    });

    describe('Async tests', function(){
      it('listenTo()\'s .then method gets invoked when the Firebase endpoint changes', function(done){
        var flag = false;
        base.listenTo(testEndpoint, {
          context: {},
          then(data){
            if(flag === true){
              expect(data).toEqual(dummyObjData);
              done()
            }
          }
        });
        setTimeout(() => {
          flag = true;
          ref.child(testEndpoint).set(dummyObjData);
        }, 1000)
      });

      it('listenTo\'s .then method gets invoked when the Firebase endpoint changes and correctly updates the component\'s state', function(done){
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
                Name: {this.state.name} <br />
                Age: {this.state.age}
              </div>
            )
          }
        }
        React.render(<TestComponent />, document.body);
      });


      it('listenTo should return the data as an array if the asArray property of options is set to true', function(done){
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
            ref.child(testEndpoint).set(dummyObjData);
          }
          componentDidUpdate(){
            expect(this.state.data.indexOf(25)).not.toBe(-1);
            expect(this.state.data.indexOf('Tyler McGinnis')).not.toBe(-1);
            done();
          }
          componentWillUnmount(){
            base.removeBinding(this.ref);
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
        React.render(<TestComponent />, document.body);
      });
    });
  });

  describe('bindToState()', function(){

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
      var invalidOptions = [[], {}, {context: undefined}, {context: 'strNotObj'}, {context: window, state: undefined}, {context: window, state: function(){}}, {context: window, state: 'test', then: function(){}}];
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
            this.ref = base.bindToState('userData', {
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
          componentWillUnmount(){
            base.removeBinding(this.ref);
          }
          render(){
            return (
              <div>
                No Data
              </div>
            );
          }
        }
        React.render(<TestComponent />, document.body);
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
          componentWillMount(){
            this.firstRef = base.bindToState('abcdefg', {
              context: this,
              state: 'emptyObj',
            });

            this.secondRef = base.bindToState('hijklmnop', {
              context: this,
              state: 'emptyArr',
              asArray: true
            });
          }
          componentDidMount(){
            this.forceUpdate();
          }
          componentDidUpdate(){
            expect(this.state.emptyObj).toEqual({});
            expect(this.state.emptyArr).toEqual([]);
            done();
          }
          componentWillUnmount(){
            base.removeBinding(this.firstRef);
            base.removeBinding(this.secondRef);
          }
          render(){
            return (
              <div>
                No Data
              </div>
            )
          }
        }
        React.render(<TestComponent />, document.body);
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
        React.render(<TestComponent />, document.body);
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
            this.ref = base.bindToState('myFriends', {
              context: this,
              state: 'friends',
              asArray: true
            });
          }
          componentDidMount(){
            ref.child('myFriends').set(dummyArrData);
          }
          componentDidUpdate(){
            expect(this.state.friends).toEqual(dummyArrData);
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
        React.render(<TestComponent />, document.body);
      });
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
      React.render(<TestComponent />, document.body);
    });
  });

  describe('syncState()', function(){
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
        class TestComponent extends React.Component {
          constructor(props) {
            super(props);
            this.state = {
              one: 0,
              two: 0,
              three: 0
            }
          }

          componentWillMount() {
            this.refOne = base.syncState('one', {
              context: this,
              state: 'one'
            });

            this.refTwo = base.syncState('two', {
              context: this,
              state: 'two'
            });

            this.refThree = base.syncState('three', {
              context: this,
              state: 'three'
            });

            this.counter = 0;

            this.listenerOne = base.listenTo('one', {
              context: this,
              then(data) {
                expect(data).toEqual(1);
                this.counter++;
              }
            });

            this.listenerTwo = base.listenTo('two', {
              context: this,
              then(data) {
                expect(data).toEqual(2);
                this.counter++;
              }
            });

            this.listenerThree = base.listenTo('three', {
              context: this,
              then(data) {
                expect(data).toEqual(3);
                this.counter++;
              }
            });
          }

          checkDone() {
            if (this.counter == 3) {
              done();
            }
          }

          componentDidUpdate() {
            this.checkDone();
          }

          componentDidMount() {
            this.setState({ one: 1 });
            this.setState({ two: 2 });
            this.setState({ three: 3 });
          }

          componentWillUnmount() {
            base.reset();
          }

          render(){
            return (
              <div>
                No Data
              </div>
            )
          }
        }
        React.render(<TestComponent />, document.body);
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
            ref.child(testEndpoint).set(null);
          }
          componentDidUpdate(){
            expect(this.state.data).toEqual({});
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
        React.render(<TestComponent />, document.body);
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
        React.render(<TestComponent />, document.body);
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
            this.ref = base.syncState('userData', {
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
            ref.child('userData').once('value', (snapshot) => {
              var data = snapshot.val();
              expect(data).toEqual(this.state.user);
              expect(data).toEqual({name: 'Tyler'});
              done();
            });
          };
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
        React.render(<TestComponent />, document.body);
      });

      it('syncState() invokes .then when the initial listener is set', function(done){
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              loading: true,
            }
          }
          componentDidMount(){
            this.ref = base.syncState('userData', {
              context: this,
              state: 'user',
              then(){
                this.setState({
                  loading: false
                }, () => {
                  expect(this.state.loading).toEqual(false);
                  done();
                })
              }
            });
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
        React.render(<TestComponent />, document.body);
      });


      it('syncState() syncs its local state with Firebase as an Array', function(done){
        class TestComponent extends React.Component{
          constructor(props){
            super(props);
            this.state = {
              friends: []
            }
          }
          componentWillMount(){
            this.ref = base.syncState('myFriends', {
              context: this,
              state: 'friends',
              asArray: true
            });
          }
          componentDidMount(){
            this.setState({
              friends: dummyArrData
            });
          }
          componentDidUpdate(){
            ref.child('myFriends').once('value', (snapshot) => {
              var data = snapshot.val();
              expect(data).toEqual(this.state.friends);
              expect(data).toEqual(dummyArrData);
              done();
            });
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
        React.render(<TestComponent />, document.body);
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
            this.ref = base.syncState('userData', {
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
            ref.child('userData').once('value', (snapshot) => {
              var data = snapshot.val();
              expect(data).toEqual(this.state.user);
              expect(data).toEqual(nestedObj);
              done();
            });
          };
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
        React.render(<TestComponent />, document.body);
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
            this.ref = base.syncState('users', {
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
          componentWillUnmount(){
            base.removeBinding(this.ref);
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
              done();
            }
          }
          render(){
            return <div>IQ</div>
          }
        }
        React.render(<TestComponent />, document.body);
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
          this.ref = base.syncState('users', {
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
        componentWillUnmount(){
          base.removeBinding(this.ref);
        }
        componentDidUpdate(){
          if(!this.state.hasUpdated) this.setState({ hasUpdated: true });
          if(this.state.hasUpdated){
            expect(this.state.users[0].timestamp).toEqual(jasmine.any(Number));
            done();
          }
        }
        render(){
          return <div>IQ</div>
        }
      }
      React.render(<TestComponent />, document.body);
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
          this.ref = base.syncState('user', {
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
        componentWillUnmount(){
          base.removeBinding(this.ref);
        }
        componentDidUpdate(){
          if(!this.state.hasUpdated) this.setState({ hasUpdated: true });
          if(this.state.hasUpdated){
            expect(this.state.user.timestamp).toEqual(jasmine.any(Number));
            done();
          }
        }
        render(){
          return <div>IQ</div>
        }
      }
      React.render(<TestComponent />, document.body);
    });

  });

  describe('Exposed firebase namespaces', function(){

    it('storage object should be exposed', function(){
      expect(base.storage).not.toBeUndefined();
    });

    it('storage ref should be accessible', function(){
      var storage = base.storage();
      var ref = storage.ref();
      expect(ref.bucket).toEqual(firebaseConfig.storageBucket);
      expect(ref.child).toEqual(jasmine.any(Function));
    });

    it('auth object should be exposed', function(){
      expect(base.auth).not.toBeUndefined();
    });
    
    it('database object should be exposed', function(){
      expect(base.database).not.toBeUndefined();
      expect(base.database.ServerValue).not.toBeUndefined();
      expect(base.database.ServerValue.TIMESTAMP).not.toBeUndefined();
    });
    
    it('app object should be exposed', function(){
      expect(base.app).not.toBeUndefined();
    });

  });

  describe('Firebase Server Info', function(){

    it('correctly retrieves Server Time Offset', function(done){
      base.fetch('.info/serverTimeOffset', {
        context: this,
        then: data => {
          expect(data).toEqual(jasmine.any(Number));
          done();
        }
      });
    });

  });
 
  describe('Auth tests', function(){

      it('Fails trying to log with an unknown user', function(done){
        base.authWithPassword({
          email: dummyUsers.unknown.email,
          password: dummyUsers.unknown.password
        }, function(error, authData) {
            expect(error).not.toBeNull();
            expect(authData).toBeUndefined();
            done();
        });
      });

      it('Succeeds to log with a known user', function(done){
        base.authWithPassword({
          email: dummyUsers.known.email,
          password: dummyUsers.known.password
        }, function(error, authData) {
            expect(error).toBeNull();
            expect(authData).not.toBeNull();
            done();
        });

      });

      it('Listens to the auth event', function(done){
        var unsubscribe = base.onAuth(authData => {
          expect(authData).not.toBeNull();
          //unsubscribe auth listener
          unsubscribe();
          done();
        });
      });

      it('Succeeds to get users authentication data', function(done) {
        //sign in first
        base.authWithPassword({
            email: dummyUsers.known.email,
            password: dummyUsers.known.password
        }, function(error, authData){
            expect(error).toBeNull();
            var currentUser = base.getAuth();
            expect(currentUser).toEqual(authData);
            done();
        });
      });

      describe('unauth()', function() {

        it('unauth() should log the user out', function(done){
            //sign in first
            base.authWithPassword({
                email: dummyUsers.known.email,
                password: dummyUsers.known.password
            }, function(error, authData){
                //expect user is logged in
                expect(error).toBeNull();
                var currentUser = base.getAuth();
                expect(currentUser).toEqual(authData);
                //log user out
                base.unauth();
                setTimeout(() => {
                  //expect user is now logged out
                  var user = base.getAuth();
                  expect(user).toBeNull();
                  done();
                }, 500);
            });
        });

      });
      describe('authWithOAuthPopup()', function(){
        
        it('authWithOAuthPopup() should throw an error if unknown provider requested', function(done){
            try {
              base.authWithOAuthPopup('someauthprovider', function(error, authData){
                done('authWithOAuthPopup() should throw but did not');
              });
            } catch(err) {
                expect(err.code).toEqual('UNKNOWN AUTH PROVIDER');
                done();
            }
        });

      });
  });

  describe('User tests', function() {
    it('Fails to create with invalid email', function(done) {
      base.createUser({
        email: dummyUsers.invalid.email,
        password: dummyUsers.invalid.password,
      }, function(error, userData) {
          expect(error).not.toBeNull();
          expect(userData).toBeUndefined();
          done();
        });
    });

    it('Succeeds to create a valid user', function(done) {
      base.createUser({
          email: dummyUsers.toDelete.email,
          password: dummyUsers.toDelete.password,
        }, function(error, userData) {
          expect(error).toBeNull();
          expect(userData).not.toBeNull();
          //delete user 
          userData.delete().then(() => {
            done();
          });
        });
    });

    it('Fails to reset password for non-existant user', function(done) {
      base.resetPassword({
        email: dummyUsers.unknown.email,
      }, function(error) {
        expect(error).not.toBeNull();
        done();
      });
    });

    it('Succeeds to reset password for a user', function(done) {
      base.resetPassword({
        email: dummyUsers.known.email,
      }, function(error) {
        expect(error).toBeNull();
        done();
      });
    });

  });

});
