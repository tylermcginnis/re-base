import React from 'react';
import PropTypes from 'prop-types';
import NotesList from './NotesList';
import AddNote from './AddNote';

class Notes extends React.Component {
  render() {
    return (
      <div>
        <h3> Notes for {this.props.username} </h3>
        <AddNote username={this.props.username} addNote={this.props.addNote} />
        <NotesList notes={this.props.notes} />
      </div>
    );
  }
}

Notes.propTypes = {
  username: PropTypes.string.isRequired,
  notes: PropTypes.array.isRequired,
  addNote: PropTypes.func.isRequired
};

export default Notes;
