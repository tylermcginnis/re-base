import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container';
import NewChat from './components/NewChat';

console.log('Please change to your own firebase address in src/App.js');

import base from './rebase';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }
  componentWillMount() {
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
  render() {
    return (
      <div style={{ paddingTop: '30px' }}>
        <NewChat chats={this.state.messages} />
        <Container />
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
