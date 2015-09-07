module.exports = (function(){
  var Firebase = require('firebase');

  var baseUrl = '';
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
    query(options){
      this.notObject(options);
      var validQueries = ['limitToFirst', 'limitToLast', 'orderByChild', 'orderByValue', 'orderByKey', 'orderByPriority', 'startAt', 'endAt', 'equalTo'];
      var queries = options.queries;
      for(var key in queries){
        if(queries.hasOwnProperty(key) && validQueries.indexOf(key) === -1){
          _throwError(`The query field must contain valid Firebase queries.  Expected one of [${validQueries.join(', ')}]. Instead, got ${key}`, 'INVALID_OPTIONS');
        }
      }
    },
    makeError(prop, type, actual){
      _throwError(`The options argument must contain a ${prop} property of type ${type}. Instead, got ${actual}`, 'INVALID_OPTIONS');
    }
  };

  function _toArray(obj){
    var arr = [];
    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        if(_isObject(obj[key])){
          obj[key].key = key;
        }
        arr.push(obj[key]);
      }
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
    options.queries && optionValidators.query(options);
    var ref = new Firebase(`${baseUrl}/${endpoint}`);
    ref = _addQueries(ref, options.queries);
    ref.once('value', (snapshot) => {
      var data = options.asArray === true ? _toArray(snapshot.val()) : snapshot.val();
      options.then.call(options.context, data);
    });
  };

  function _firebaseRefsMixin(endpoint, invoker, ref){
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
  };

  function _addListener(endpoint, invoker, options, ref){
    ref = _addQueries(ref, options.queries);
    firebaseListeners[endpoint][invoker] = ref.on('value', (snapshot) => {
      var data = snapshot.val();
      data = data === null ? (options.asArray === true ? [] : {}) : data;
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
    options.queries && optionValidators.query(options);
    var ref = new Firebase(`${baseUrl}/${endpoint}`);
    _firebaseRefsMixin(endpoint, invoker, ref);
    _addListener(endpoint, invoker, options, ref);
    return  _returnRef(endpoint, invoker);
  };

  function _updateSyncState(ref, data, key){
    if(_isObject(data)) {
      for(var prop in data){
        _updateSyncState(ref.child(prop), data[prop], prop);
      }
    } else {
      ref.set(data);
    }
  };

  function _sync(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    optionValidators.state(options);
    options.queries && optionValidators.query(options);
    if(_sync.called !== true){
      _sync.reactSetState = options.context.setState;
      _sync.called = true;
    } else {
      options.context.setState = _sync.reactSetState;
    }
    options.reactSetState = options.context.setState;
    var ref = new Firebase(`${baseUrl}/${endpoint}`);
    _firebaseRefsMixin(endpoint, 'syncState', ref);
    _addListener(endpoint, 'syncState', options, ref);
    options.context.setState = function (data) {
      for (var key in data) {
        if(data.hasOwnProperty(key)){
          if (key === options.state) {
            _updateSyncState.call(this, ref, data[key], key)
         } else {
            options.reactSetState.call(options.context, data);
         }
        }
     }
    };
    return _returnRef(endpoint, 'syncState');
  };

  function _post(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.data(options);
    var ref = new Firebase(`${baseUrl}/${endpoint}`);
    if(options.then){
      ref.set(options.data, options.then);
    } else {
      ref.set(options.data);
    }
  };

  function _addQueries(ref, queries){
    var needArgs = {
      limitToFirst: true,
      limitToLast: true,
      orderByChild: true,
      startAt: true,
      endAt: true,
      equalTo: true
    };
    for(var key in queries){
      if(queries.hasOwnProperty(key)){
        if(needArgs[key]) {
          ref = ref[key](queries[key]);
        } else {
          ref = ref[key]();
        }
      }
    }
    return ref;
  };

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
    rebase = undefined;
    for(var key in firebaseRefs){
      if(firebaseRefs.hasOwnProperty(key)){
        for(var prop in firebaseRefs[key]){
          if(firebaseRefs[key].hasOwnProperty(prop)){
            firebaseRefs[key][prop].off('value', firebaseListeners[key][prop]);
            delete firebaseRefs[key][prop];
            delete firebaseListeners[key][prop];
          }
        }
      }
    }
    firebaseRefs = {};
    firebaseListeners = {};
  };

  function _authWithPassword(credentials ,fn){
    var ref = new Firebase(`${baseUrl}`);
    return ref.authWithPassword(credentials, function(error, authData){
      return fn(error, authData);
    });
  }

  function _onAuth(fn){
    var ref = new Firebase(`${baseUrl}`);
    return ref.onAuth(fn);
  }

  function _offAuth(fn){
    var ref = new Firebase(`${baseUrl}`);
    return ref.offAuth(fn);
  }

  function _unauth(){
    var ref = new Firebase(`${baseUrl}`);
    return ref.unauth();
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
      },
      authWithPassword(credentials, fn){
        return _authWithPassword(credentials, fn);
      },
      onAuth(fn){
        return _onAuth(fn);
      },
      offAuth(fn){
        return _offAuth(fn);
      },
      unauth(fn){
        return _unauth();
      }
    }
  };

  return {
    createClass(url){
      if(rebase) {
        return rebase;
      }

      _validateBaseURL(url);
      baseUrl = url;
      rebase = init();

      return rebase
    }
  };
})();
