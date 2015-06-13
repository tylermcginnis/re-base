var Rebase = require('../../dist/bundle');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('re-base Tests:', function(){
  describe('createClass', function(){
    it('returns an object', function(){
      var base = Rebase.createClass('https://edqio.firebaseio.com/');
      expect(base).not.toBe(undefined);
    });
  });

  describe('post():', function(){
    it('post() throws errors given invalid Firebase refs', function(){
      class TestComponent extends React.Component{
        render(){
          return (
            <div> testing </div>
          )
        }
      }

      React.render(TestComponent, document.body);
    });
  });
});