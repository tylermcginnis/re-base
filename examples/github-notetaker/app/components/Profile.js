import React from 'react';
import Repos from './Github/Repos';
import UserProfile from './Github/UserProfile';
import Notes from './Notes/Notes';
import helpers from '../utils/helpers';
import base from '../rebase';
import PropTypes from 'prop-types';

console.log(
  'Please change to your own firebase address in app/components/Profile.js'
);

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      bio: {},
      repos: []
    };
  }
  init(username) {
    this.ref = base.syncState(`/github/${username}`, {
      context: this,
      asArray: true,
      state: 'notes'
    });

    helpers.getGithubInfo(username).then(dataObj => {
      this.setState({
        bio: dataObj.bio,
        repos: dataObj.repos
      });
    });
  }
  componentDidMount() {
    const { username } = this.props.match.params;
    this.init(username);
  }
  componentWillReceiveProps(nextProps) {
    const currentUsername = this.props.match.params.username;
    const nextUsername = nextProps.match.params.username;
    if (currentUsername !== nextUsername) {
      base.removeBinding(this.ref);
      this.init(nextUsername);
    }
  }
  handleAddNote(newNote) {
    this.setState({
      notes: this.state.notes.concat([newNote])
    });
  }
  render() {
    const { username } = this.props.match.params;
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={username}
            notes={this.state.notes}
            addNote={this.handleAddNote.bind(this)}
          />
        </div>
      </div>
    );
  }
}

Profile.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Profile;
