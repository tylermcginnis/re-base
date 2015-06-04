/*
  listenTo: Listens to a Firebase endpoint and invokes a callback function when that endpoint changes.
  bindToState: Listens to a Firebase endpoint and updates a specified property (if an array) or the whole state if an Object.
  removeBinding: Removes bindings. Used in componentDidUnmount.
  syncState: todo. Create a 2 way data binding between Firebase and your State.
*/

module.exports = (function(){
  var Firebase = require('firebase');

  var baseUrl = '';
  var ref = null;
  var rebase;
  var firebaseRefs = {};
  var firebaseListeners = {};

  function _toArray(obj){
    var arr = [];
    for(var key in obj){
      arr.push(obj[key]);
    }
    return arr;
  }

  function _isObject(obj){
    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
  }

  function _throwError(msg, code){
    var err = new Error(`REBASE: ${msg}`);
    err.code = code;
    throw err;
  }

  function _validateBaseURL(url){
    var defaultError = 'Rebase.createClass failed.';
    var errorMsg;
    if(typeof url !== 'string'){
      errorMsg = `${defaultError} URL must be a string.`;
    } else if(!url || arguments.length > 1){
      errorMsg = `${defaultError} Was called with more or less than 1 argument. Expects 1.`
    } else if(url.length === ''){
      errorMsg = `${defaultError} URL cannot be an empty string.`
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_URL");
    }
  };

  function _validateEndpoint(endpoint){
    var defaultError = 'The Firebase endpoint you are trying to listen to ';
    var errorMsg;
    if(typeof endpoint !== 'string'){
      errorMsg = `${defaultError} must be a string. Instead, got ${endpoint}`;
    } else if(endpoint.length === 0){
      errorMsg = `${defaultError} must be a non-empty string. Instead, got ${endpoint}`;
    } else if(endpoint.length > 768){
      errorMsg = `${defaultError} is too long to be stored in Firebase. It be less than 768 characters.`;
    } else if(/[\[\].#$\/\u0000-\u001F\u007F]/.test(endpoint)) {
      errorMsg = `${defaultError} cannot contain any of the following characters. "# $ ] [ /" Instead, got ${defaultError}`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_ENDPOINT");
    }
  };

  function _validateOptions(options, invoker){
    var errorMsg;
    if(!_isObject(options)){
      errorMsg = `options argument must be an Object. Instead, got ${options}.`;
    } else if(!options.context || !_isObject(options.context)){
      errorMsg = `options argument must contain a context property which is an Object. Instead, got ${options.context}.`;
    } else if(invoker === 'bindToState' && options.asArray === true && !options.state){
      errorMsg = "Because your component's state must be an object, if you use asArray you must also specify a state property to which the new array will be a value of."
    } else if (options.then && typeof options.then !== 'function'){
      errorMsg = `options.then must be a function. Instead, got ${options.then}.`;
    } else if (options.then && options.state){
      errorMsg = "Since options.then is a callback function which gets invoked with the data from Firebase, you shouldn't have options.then and also specify the state with options.state.";
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_OPTIONS");
    }
  };

  function _setState(newState, context){
    context.setState(newState);
  }

  function _bind(endpoint, options, invoker){
    _validateEndpoint(endpoint);
    _validateOptions(options, invoker);
    //should be [options.state]
    firebaseRefs[endpoint] = ref.ref();
    firebaseListeners[endpoint] = ref.child(endpoint).on('value', (snapshot) => {
      var data = snapshot.val();
      if(options.then){
        options.asArray === true ? options.then(_toArray(data)) : options.then(data);
      } else {
        if(options.state){
          var newState = {};
          options.asArray === true ? newState[options.state] = _toArray(data) : newState[options.state] = data;
          _setState(newState, options.context);
        } else {
          _setState(data, options.context);
        }
      }
    }, options.onConnectionLoss);
  };

  function _removeBinding(endpoint){
    //check if endpoint and not property on state.
    _validateEndpoint(endpoint);

    if (typeof firebaseRefs[endpoint] === "undefined") {
      var errorMsg = `Unexpected value for endpoint. ${endpoint} was either never bound or has already been unbound.`;
      _throwError(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
    }

    firebaseRefs[endpoint].off('value', firebaseListeners[endpoint]);
    delete firebaseRefs[endpoint];
    delete firebaseListeners[endpoint];
  }

  function _sync(endpoint, options){
    _validateEndpoint(endpoint);
    _validateOptions(options);
    //2 way data binding
  }

  function init(){
    return {
      listenTo(endpoint, options){
        _bind(endpoint, options, 'listenTo');
      },
      bindToState(endpoint, options){
        _bind(endpoint, options, 'bindToState');
      },
      syncState(endpoint, options){
        _sync(endpoint, options);
      },
      removeBinding(endpoint){
        _removeBinding(endpoint);
      }
    }
  }

  return {
    createClass(url){
      if(rebase) {
        return rebase;
      }

      _validateBaseURL(url);
      baseUrl = url;
      ref = new Firebase(baseUrl);
      rebase = init();

      return rebase
    }
  };
})();