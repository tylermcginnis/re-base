import React from 'react';
import Container from './components/Container';
import NewChat from './components/NewChat';

import Rebase from 're-base';
var base = Rebase.createClass('https://github-note-taker.firebaseio.com');

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages: []
    };
  }
  componentWillMount(){
  /*
   * Here we call 'bindToState', which will update
   * our local 'messages' state whenever our 'chats'
   * Firebase endpoint changes.
   */
    base.bindToState('chats', {
      context: this,
      state: 'messages',
      asArray: true
    });
  }
  render(){
    return (
      <div style={ { paddingTop: '30px' } }>
        <NewChat chats={ this.state.messages } />
        <Container />
      </div>
    )
  }
}

React.render(<Main />, document.getElementById('app'));
