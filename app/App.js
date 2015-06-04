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
      },
      onConnectionLoss(err){
        console.log('Error!', err);
      }
    });

    base.bindToState('temp', {
      asArray: true,
      context: this,
      state: 'stateQueue',
      onConnectionLoss(err){
        console.log("Error!", err);
      }
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