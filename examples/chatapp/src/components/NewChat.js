import React from 'react';
import Rebase from 're-base';

var base = Rebase.createClass('https://jt-ts.firebaseio.com/rebase-chat');
console.log('Please change to your own firebase address in components/NewChat.js');


class NewChat extends React.Component {
  _newChat(e){
    e.preventDefault();

    /*
     * Here, we call .post on the '/chats' ref
     * of our Firebase.  This will do a one-time 'set' on
     * that ref, replacing it with the data prop in the
     * options object.
     *
     * Keeping with the immutable data paradigm in React,
     * you should never mutate, but only replace,
     * the data in your Firebase (ie, use concat
     * to return a mutated copy of your state)
    */

    base.post('chats', {
      data: this.props.chats.concat([{
        title: this.refs.title.getDOMNode().value ,
        message: this.refs.message.getDOMNode().value
      }]),
      context: this,
      /*
       * This 'then' method will run after the
       * post has finished.
       */
      then: () => {
        console.log('POSTED');
      }
    });

    this.refs.message.getDOMNode().value = '';
    this.refs.title.getDOMNode().value = '';

  }
  render(){
    return (
      <div className='col-md-12'>
        <form onSubmit={ this._newChat.bind(this) } className='form-group col-md-8'>
          <input ref='title' type='text' placeholder='Title' className='form-control' />
          <textarea ref='message'  placeholder='Message' className='form-control' />
          <input type='submit' className='btn btn-success' />
        </form>
      </div>
    )
  }
}

export default NewChat;
