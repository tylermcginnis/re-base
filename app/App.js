var React = require('react');
var Rebase = require('./rebase');

var base = Rebase.createClass('https://edqio.firebaseio.com');

class App extends React.Component {
  componentDidMount(){
    base.listenTo('queue', {
      asArray: true,
      context: this,
      then(data){
        console.log("ListenTo Data", data);
      }
    });

    //if asArray is true then state must be defined since state has to be an object
    base.bindToState('temp', {
      asArray: true,
      context: this,
      state: 'stateQueue'
    });

    base.syncState('classes', {
      context: this,
    });
  }
  componentWillUnmount(){
    base.removeBinding('queue');
  }
  render(){
    console.log("Render's State: ", this.state);
    return (<div>Hi</div>)
  }
}

React.render(
  <App />,
  document.getElementById('app')
);