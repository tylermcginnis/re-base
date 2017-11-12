import React from 'react';

class NotesList extends React.Component {
  render() {
    var notes = this.props.notes.map((item, index) => {
      return (
        <li className="list-group-item" key={index}>
          {item.note}
        </li>
      );
    });
    return <ul className="list-group">{notes}</ul>;
  }
}

export default NotesList;
