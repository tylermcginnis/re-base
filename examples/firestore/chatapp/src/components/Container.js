import React from 'react';
import Message from './Message.js';
import base from '../rebase';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: null
    };
  }
  _removeMessage(ref, e) {
    e.stopPropagation();
    base.removeDoc(ref);
  }
  _toggleView(index) {
    /*
     * Because nothing is bound to our 'show' state, calling
     * setState on 'show' here will do nothing with Firebase,
     * but simply update our local state like normal.
     */
    this.setState({
      show: index
    });
  }
  render() {
    var messages = this.props.messages.map((item, index) => {
      return (
        <Message
          thread={item}
          show={this.state.show === index}
          removeMessage={this._removeMessage.bind(this, item.ref)}
          handleClick={this._toggleView.bind(this, index)}
          key={index}
        />
      );
    });

    return (
      <div className="col-md-12">
        <div className="col-md-8">
          <h1>{(this.props.messages.length || 0) + ' messages'}</h1>
          <ul style={{ listStyle: 'none' }}>{messages}</ul>
        </div>
      </div>
    );
  }
}

export default Container;
