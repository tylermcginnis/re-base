import React from 'react';

class UserProfiles extends React.Component{
  render(){
    return (
      <div>
        <h3> User Profile </h3>
        <ul className="list-group">
          {this.props.bio.avatar_url && <li className="list-group-item"> <img src={this.props.bio.avatar_url} className="img-rounded img-responsive"/></li>}
          {this.props.bio.name && <li className="list-group-item">Name: {this.props.bio.name}</li>}
          {this.props.bio.login && <li className="list-group-item">Username: {this.props.bio.login}</li>}
          {this.props.bio.email && <li className="list-group-item">Email: {this.props.bio.email}</li>}
          {this.props.bio.location && <li className="list-group-item">Location: {this.props.bio.location}</li>}
          {this.props.bio.company && <li className="list-group-item">Company: {this.props.bio.company}</li>}
          {this.props.bio.followers && <li className="list-group-item">Followers: {this.props.bio.followers}</li>}
          {this.props.bio.following && <li className="list-group-item">Following: {this.props.bio.following}</li>}
          {this.props.bio.following && <li className="list-group-item">Public Repos: {this.props.bio.public_repos}</li>}
          {this.props.bio.blog && <li className="list-group-item">Blog: <a href={this.props.bio.blog}> {this.props.bio.blog}</a></li>}
        </ul>
      </div>
    )
  }
};

UserProfiles.propTypes = {
  username: React.PropTypes.string.isRequired,
  bio: React.PropTypes.object.isRequired
}

export default UserProfiles;