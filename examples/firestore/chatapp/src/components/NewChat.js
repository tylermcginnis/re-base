import React from 'react';
import ReactDOM from 'react-dom';
import base from '../rebase';

class NewChat extends React.Component {
  _newChat(e) {
    e.preventDefault();

    /*
     * Here, we call addToCollection on the '/chats' collection
     * in Firestore.  This will create a new document in the collection.
     *
     */

    base.addToCollection('chats', {
      title: ReactDOM.findDOMNode(this.refs.title).value,
      message: ReactDOM.findDOMNode(this.refs.message).value
    });

    ReactDOM.findDOMNode(this.refs.message).value = '';
    ReactDOM.findDOMNode(this.refs.title).value = '';
  }
  render() {
    return (
      <div className="col-md-12">
        <form
          onSubmit={this._newChat.bind(this)}
          className="form-group col-md-8"
        >
          <input
            ref="title"
            type="text"
            placeholder="Title"
            className="form-control"
            style={{ margin: '5px auto' }}
          />
          <textarea
            ref="message"
            placeholder="Message"
            className="form-control"
            style={{ margin: '5px auto' }}
          />
          <input type="submit" className="btn btn-success" />
        </form>
      </div>
    );
  }
}

export default NewChat;
