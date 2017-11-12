import React from 'react';
import PropTypes from 'prop-types';

class Repos extends React.Component {
  render() {
    var repos = this.props.repos.map((repo, index) => {
      return (
        <li className="list-group-item" key={index}>
          {repo.html_url && (
            <h4>
              <a href={repo.html_url}>{repo.name}</a>
            </h4>
          )}
          {repo.description && <p> {repo.description}</p>}
        </li>
      );
    });
    return (
      <div>
        <h3> User Repos </h3>
        <ul className="list-group">{repos}</ul>
      </div>
    );
  }
}

Repos.propTypes = {
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
};

module.exports = Repos;
