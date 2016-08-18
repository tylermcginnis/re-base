import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';

class SearchGithub extends React.Component{
  handleSubmit(e){
    e.preventDefault();
    var username = ReactDOM.findDOMNode(this.refs.username).value;
    ReactDOM.findDOMNode(this.refs.username).value = '';
    this.props.router.push(`/profile/${username}`);
  }
  render(){
    return (
      <div className="col-sm-12">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group col-sm-7">
            <input type="text" className="form-control" ref="username" />
          </div>
          <div className="form-group col-sm-5">
            <button type="submit" className="btn btn-block btn-primary">Search Github </button>
          </div>
        </form>
      </div>
    )
  }
};

SearchGithub.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default withRouter(SearchGithub);
