import React from 'react';
import Repos from './Github/Repos';
import UserProfile from './Github/UserProfile';
import Notes from './Notes/Notes';
import helpers from '../utils/helpers';
import Rebase from 're-base';

var base = Rebase.createClass({
    apiKey: "AIzaSyBm3py9af9BqQMfUMnMKpAXJUfxlsegnDI",
    authDomain: "qwales1-test.firebaseapp.com",
    databaseURL: "https://qwales1-test.firebaseio.com",
    storageBucket: "qwales1-test.appspot.com",
});
console.log('Please change to your own firebase address in app/components/Profile.js');

class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notes: [],
      bio: {},
      repos: []
    };
  }
  init(){
    this.ref = base.syncState(`/github/${this.props.routeParams.username}`, {
      context: this,
      asArray: true,
      state: 'notes'
    });

    helpers.getGithubInfo(this.props.routeParams.username)
      .then((dataObj) => {
        this.setState({
          bio: dataObj.bio,
          repos: dataObj.repos
        });
      });
  }
  componentDidMount(){
    this.init();
  }
  componentWillUnmount(){
    base.removeBinding(this.ref);
  }
  componentWillReceiveProps(){
    base.removeBinding(this.ref);
    this.init();
  }
  handleAddNote(newNote){
    this.setState({
      notes: this.state.notes.concat([newNote])
    })
  }
  render(){
    var username = this.props.routeParams.username;
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={username} bio={this.state.bio}/>
        </div>
        <div className="col-md-4">
          <Repos username={username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={username}
            notes={this.state.notes}
            addNote={this.handleAddNote.bind(this)} />
        </div>
      </div>
    )
  }
};

Profile.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Profile;
