var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Firebase = require('firebase');

var firebaseUrl = 'https://rebase-demo.firebaseio.com/';
var ref = new Firebase(firebaseUrl);
var invalidFirebaseURLs = [null, undefined, true, false, [], 0, 5, "", "a", ["hi", 1]];
var invalidEndpoints = ['', 'ab.cd', 'ab#cd', 'ab$cd', 'ab[cd', 'ab]cd'];
var dummyObjData = {name: 'Tyler McGinnis', age: 25};
var dummyNestedObjData = {about: {name: 'Tyler', age: 25}, friends: {jacob: {name: 'Jacob Turner', age: 23}}};
var nestedObjArrResult = [{age: 25, key: 'about', name: 'Tyler'}, {key: 'friends', jacob: {age: 23, name: 'Jacob Turner'}}];
var dummyArrData = ['Tyler McGinnis', 'Jacob Turner', 'Ean Platter'];
var testEndpoint = 'test/child';
var base;

describe('re-base Tests:', function(){
  beforeEach(function(done){
    base = Rebase.createClass(firebaseUrl);
    ref.set(null, done);
  });

  afterEach(function(done){
    React.unmountComponentAtNode(document.body);
    base.reset();
    base = null;
    done();
  });

  describe('createClass()', function(){
    it('createClass() throws an error given an invalid Firebase URL', function(){
      invalidFirebaseURLs.forEach(function(URL){
        try {
          Rebase.createClass(URL)
        } catch(err){
          expect(err.code).toEqual('INVALID_URL');
        }
      });
    });

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
    });
    it('createClass() returns a singleton if it\'s already been invoked', function(){
      var newBase = Rebase.createClass(firebaseUrl);
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

  describe('fetch()', function(){
    it('fetch() throws an error given a invalid endpoint', function(done){
      invalidEndpoints.forEach((endpoint) => {
        try {
          base.fetch(endpoint, {
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
              done();
            }
          })
        } catch(err) {
          expect(err.code).toEqual('INVALID_ENDPOINT');
          done();
        }
      });
    });

    it('listenTo() throws an error given an invalid options object', function(){
      var invalidOptions = [[], {}, {then: function(){}}, {context: undefined}, {context: 'strNotObj'}, {context: window, then: undefined}, {context: window, then: 'strNotFn'}];
      invalidOptions.forEach((option) => {
        try {
          base.post(testEndpoint, option);
        } catch(err) {
          expect(err.code).toEqual('INVALID_OPTIONS');
        }
      });
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
                this.setState({data})
              },
              asArray: true
            });
          }
          componentDidMount(){
            var flag = true;
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
      ref.child(testEndpoint).set(dummyObjData);
      class TestComponent extends React.Component{
        constructor(props){
          super(props);
          this.state = {
            data: {}
          }
        }
        componentDidMount(){
          this.ref = base.bindToState(testEndpoint, {
            context: this,
            state: 'data',
          });
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
                name: 'Mary',
                iq: 169
              }, {
                name: 'Jill',
                iq: 105
              }, {
                name: 'Pat',
                iq: 179
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
            if(!this.state.hasUpdated) this.setState({ hasUpdated: true })
          }
          render(){
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
              var names = this.state.users.reduce((prev, next) => {
                prev[next.name] = true;
                return prev;
              }, {});
              expect(this.state.users.length).toEqual(3);
              expect(!!(names.Mary && names.Al && names.Pat)).toEqual(true);
              done();
            }
            return <div>IQ</div>
          }
        }
        React.render(<TestComponent />, document.body);
      });
    });
  });
});
