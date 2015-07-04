import React from 'react';
import Rebase from 're-base';

import Message from './Message.js';

var base = Rebase.createClass('https://jt-ts.firebaseio.com/rebase-chat');

class Container extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      show: null
    }
  }
  componentWillMount(){

    /*
     * We bind the 'chats' firebase endopint to our 'messages' state.
     * Anytime the firebase updates, it will call 'setState' on this component
     * with the new state.
     *
     * Any time we call 'setState' on our 'messages' state, it will
     * updated the Firebase '/chats' endpoint. Firebase will then emit the changes,
     * which causes our local instance (and any other instances) to update
     * state to reflect those changes.
     */

    this.ref = base.syncState('chats', {
      context: this,
      state: 'messages'
    });
  }
  componentWillUnmount(){
    /*
     * When the component unmounts, we remove the binding.
     * Invoking syncState (or bindToState or listenTo)
     * will return a reference to that listener (see line 30).
     * You will use that ref to remove the binding here.
     */

    base.removeBinding(this.ref);
  }
  _removeMessage(index, e){
    e.stopPropagation();
    var arr = this.state.messages.concat([]);
    arr.splice(index, 1);

    /*
     * Calling setState here will update the '/chats' ref on our Firebase.
     * Notice that I'm also updating the 'show' state.  Because there is no
     * binding to our 'show' state, it will update the local 'show' state normally,
     * without going to Firebase.
     */

    this.setState({
      messages: arr,
      show: null
    });
  }
  _toggleView(index){

    /*
     * Because nothing is bound to our 'show' state, calling
     * setState on 'show' here will do nothing with Firebase,
     * but simply update our local state like normal.
     */
    this.setState({
      show: index
    });
  }
  render(){
    var messages = this.state.messages.map( (item, index) => {
      return (
        <Message
          thread={ item }
          show={ this.state.show === index }
          removeMessage={ this._removeMessage.bind(this, index) }
          handleClick={ this._toggleView.bind(this, index) }
          key={ index } />
      );
    });

    return (
      <div className='col-md-12'>
        <div className='col-md-2'></div>
        <div className='col-md-8'>
          <h1>{ (this.state.messages.length || 0) + ' messages' }</h1>
          <ul>{ messages }</ul>
        </div>
        <div className='col-md-2'></div>
      </div>
    );
  }
}

export default Container
