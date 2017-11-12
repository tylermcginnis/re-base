import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class AddNote extends React.Component {
  handleSubmit() {
    var newNote = ReactDOM.findDOMNode(this.refs.note).value;
    ReactDOM.findDOMNode(this.refs.note).value = '';
    this.props.addNote(newNote);
  }
  render() {
    return (
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          ref="note"
          placeholder="Add New Note"
        />
        <span className="input-group-btn">
          <button
            className="btn btn-default"
            type="button"
            onClick={this.handleSubmit.bind(this)}
          >
            Submit
          </button>
        </span>
      </div>
    );
  }
}

AddNote.propTypes = {
  username: PropTypes.string.isRequired,
  addNote: PropTypes.func.isRequired
};

export default AddNote;
