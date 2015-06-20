module.exports = (function(){
  var Firebase = require('firebase');

  var baseUrl = '';
  var ref = null;
  var rebase;
  var firebaseRefs = {};
  var firebaseListeners = {};

  var optionValidators = {
    notObject(options){
      if(!_isObject(options)){
        _throwError(`The options argument must be an object. Instead, got ${options}`, 'INVALID_OPTIONS');
      }
    },
    context(options){
      this.notObject(options);
      if(!options.context || !_isObject(options.context)){
        this.makeError('context', 'object', options.context);
      }
    },
    state(options){
      this.notObject(options);
      if(!options.state || typeof options.state !== 'string'){
        this.makeError('state', 'string', options.state);
      }
    },
    then(options){
      this.notObject(options);
      if(typeof options.then === 'undefined' || typeof options.then !== 'function'){
        this.makeError('then', 'function', options.then);
      }
    },
    data(options){
      this.notObject(options);
      if(typeof options.data === 'undefined'){
        this.makeError('data', 'ANY', options.data);
      }
    },
    makeError(prop, type, actual){
      _throwError(`The options argument must contain a ${prop} property of type ${type}. Instead, got ${actual}`, 'INVALID_OPTIONS');
    }
  }

  function _toArray(obj){
    var arr = [];
    for(var key in obj){
      if(_isObject(obj[key])){
        obj[key].key = key;
      }
      arr.push(obj[key]);
    }
    return arr;
  };

  function _isObject(obj){
    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
  };

  function _throwError(msg, code){
    var err = new Error(`REBASE: ${msg}`);
    err.code = code;
    throw err;
  };

  function _validateBaseURL(url){
    var defaultError = 'Rebase.createClass failed.';
    var errorMsg;
    if(typeof url !== 'string'){
      errorMsg = `${defaultError} URL must be a string.`;
    } else if(!url || arguments.length > 1){
      errorMsg = `${defaultError} Was called with more or less than 1 argument. Expects 1.`;
    } else if(url.length === ''){
      errorMsg = `${defaultError} URL cannot be an empty string.`;
    } else if(url.indexOf('.firebaseio.com') === -1){
      errorMsg = `${defaultError} URL must be in the format of https://<YOUR FIREBASE>.firebaseio.com. Instead, got ${url}.`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_URL");
    }
  };

  function _validateEndpoint(endpoint){
    var defaultError = 'The Firebase endpoint you are trying to listen to';
    var errorMsg;
    if(typeof endpoint !== 'string'){
      errorMsg = `${defaultError} must be a string. Instead, got ${endpoint}`;
    } else if(endpoint.length === 0){
      errorMsg = `${defaultError} must be a non-empty string. Instead, got ${endpoint}`;
    } else if(endpoint.length > 768){
      errorMsg = `${defaultError} is too long to be stored in Firebase. It be less than 768 characters.`;
    } else if(/^$|[\[\]\.\#\$]/.test(endpoint)){
      errorMsg = `${defaultError} in invalid. Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]".`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_ENDPOINT");
    }
  };

  function _setState(newState){
    this.setState(newState);
  };

  function _returnRef(endpoint, method){
    return { endpoint, method };
  };

  function _fetch(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    optionValidators.then(options);
    ref.child(endpoint).once('value', (snapshot) => {
      if(options.asArray === true){
        options.then.call(options.context, _toArray(snapshot.val()));
      } else {
        options.then.call(options.context, snapshot.val());
      }
    });
  };

  function _firebaseRefsMixin(endpoint, invoker){
    if(!_isObject(firebaseRefs[endpoint])){
      firebaseRefs[endpoint] = {
        [invoker]: ref.ref()
      };
      firebaseListeners[endpoint] = {};
    } else if(!firebaseRefs[endpoint][invoker]){
      firebaseRefs[endpoint][invoker] = ref.ref();
    } else {
      _throwError(`Endpoint (${endpoint}) already has listener ${invoker}`, "INVALID_ENDPOINT");
    }
    return true;
  };

  function _addListener(endpoint, invoker, options){
    firebaseListeners[endpoint][invoker] = ref.child(endpoint).on('value', (snapshot) => {
      var data = snapshot.val() || (options.asArray === true ? [] : {});
      if(invoker === 'listenTo'){
        options.asArray === true ? options.then.call(options.context, _toArray(data)) : options.then.call(options.context, data);
      } else if(invoker === 'syncState'){
          data = options.asArray === true ? _toArray(data) : data;
          options.reactSetState.call(options.context, {[options.state]: data});
      } else if(invoker === 'bindToState') {
          var newState = {};
          options.asArray === true ? newState[options.state] = _toArray(data) : newState[options.state] = data;
          _setState.call(options.context, newState);
      }
    });
  };

  function _bind(endpoint, options, invoker){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    invoker === 'listenTo' && optionValidators.then(options);
    invoker === 'bindToState' && optionValidators.state(options);
    _firebaseRefsMixin(endpoint, invoker) && _addListener(endpoint, invoker, options);
    return  _returnRef(endpoint, invoker);
  };

  function _sync(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    optionValidators.state(options);
    var context = options.context;
    options.reactSetState = context.setState;
    _firebaseRefsMixin(endpoint, 'syncState') && _addListener(endpoint, 'syncState', options);

    function _updateSyncState(ref, data, key){
      if(_isObject(data)) {
        for(var prop in data){
          _updateSyncState(ref.child(prop), data[prop], prop);
        }
      } else {
        ref.set(data);
      }
    };

    context.setState = function (data) {
      for (var key in data) {
        if (key === options.state) {
          _updateSyncState(ref.child(endpoint), data[key], key)
       } else {
          options.reactSetState.call(options.context, data);
       }
     }
    };
    return _returnRef(endpoint, 'syncState');
  };

  function _post(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.data(options);
    if(options.then){
      ref.child(endpoint).set(options.data, options.then);
    } else {
      ref.child(endpoint).set(options.data);
    }
  }

  function _removeBinding(refObj){
    _validateEndpoint(refObj.endpoint);
    if (typeof firebaseRefs[refObj.endpoint][refObj.method] === "undefined") {
      var errorMsg = `Unexpected value for endpoint. ${refObj.endpoint} was either never bound or has already been unbound.`;
      _throwError(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
    }
    firebaseRefs[refObj.endpoint][refObj.method].off('value', firebaseListeners[refObj.endpoint][refObj.method]);
    delete firebaseRefs[refObj.endpoint][refObj.method];
    delete firebaseListeners[refObj.endpoint][refObj.method];
  };

  function _reset(){
    baseUrl = '';
    ref = undefined;
    rebase = undefined;
    for(var key in firebaseRefs){
      for(var prop in firebaseRefs[key]){
        firebaseRefs[key][prop].off('value', firebaseListeners[key][prop]);
        delete firebaseRefs[key][prop];
        delete firebaseListeners[key][prop];
      }
    }
    firebaseRefs = {};
    firebaseListeners = {};
  }

  function init(){
    return {
      listenTo(endpoint, options){
        return _bind(endpoint, options, 'listenTo');
      },
      bindToState(endpoint, options){
        return _bind(endpoint, options, 'bindToState');
      },
      syncState(endpoint, options){
        return _sync(endpoint, options);
      },
      fetch(endpoint, options){
        _fetch(endpoint, options);
      },
      post(endpoint, options){
        _post(endpoint, options);
      },
      removeBinding(endpoint){
        _removeBinding(endpoint, true);
      },
      reset(){
        _reset();
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
