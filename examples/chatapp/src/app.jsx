import React from 'react';

import Container from './components/container.jsx';
import NewChat from './components/new-chat.jsx';

import Rebase from 're-base';

var base = Rebase.createClass('https://jt-ts.firebaseio.com/rebase-chat');

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = { messages: [] };
  }
  componentWillMount(){

  /*
   * Here we call 'bindToState', which will update
   * our local 'messages' state whenever our root
   * ref on Firebase changes. Changing state here
   * should be avoided, as it will not reflect in the 
   * Firebase, and changes in the Firebase may
   * overwrite local changes.
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
