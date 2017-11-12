var React = require('react');
var ReactDOM = require('react-dom');
var Rebase = require('re-base');
var List = require('./List');
var AddItem = require('./AddItem');

var base = require('./rebase');
console.log('Please change to your own firebase address in app/App.js');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true
    };
  }
  componentDidMount() {
    this.ref = base.bindCollection('todos', {
      context: this,
      state: 'list',
      withRefs: true,
      then() {
        this.setState({ loading: false });
      }
    });
  }
  handleAddItem(value) {
    base.addToCollection('todos', {
      todo: value
    });
  }
  handleRemoveItem(ref) {
    base.removeDoc(ref);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-md-offset-3">
            <div className="col-sm-12">
              <h3 className="text-center"> re-base Todo List </h3>
              <AddItem add={this.handleAddItem.bind(this)} />
              {this.state.loading === true ? (
                <h3> LOADING... </h3>
              ) : (
                <List
                  items={this.state.list}
                  remove={this.handleRemoveItem.bind(this)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
