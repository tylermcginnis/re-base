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
      if(_isObject(obj[key])){
        obj[key].key = key;
      }
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
    } else if(url.indexOf('.firebaseio.com') === -1){
      errorMsg = `${defaultError} URL must be in the format of https://<YOUR FIREBASE>.firebaseio.com. Instead, got ${url}.`
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_URL");
    }
  };

  function _validateEndpoint(endpoint, onRemove){
    var defaultError = 'The Firebase endpoint you are trying to listen to';
    var errorMsg;
    if(typeof endpoint !== 'string'){
      errorMsg = `${defaultError} must be a string. Instead, got ${endpoint}`;
    } else if(endpoint.length === 0){
      errorMsg = `${defaultError} must be a non-empty string. Instead, got ${endpoint}`;
    } else if(endpoint.length > 768){
      errorMsg = `${defaultError} is too long to be stored in Firebase. It be less than 768 characters.`;
    } else if(/^$|[\[\]\.\#\$]/.test(endpoint)){
      errorMsg = `${defaultError} in invalid. Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]".`
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
      errorMsg = `options argument must contain a context property which is an object. Instead, got ${options.context}.`;
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

  //Combine with _validateOptions on Refactor
  function _validateListenToOptions(options){
    var errorMsg;
    if(!_isObject(options)){
      errorMsg = `options argument must be an Object. Instead, got ${options}.`;
    } else if(typeof options.then === 'undefined'){
      errorMsg = `options.then is required with listenTo`;
    } else if (typeof options.then !== 'function'){
      errorMsg = `options.then must be a function.`;
    } else if(!options.context || !_isObject(options.context)){
      errorMsg = `options argument must contain a context property which is an object. Instead, got ${options.context}.`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_OPTIONS");
    }
  };

  //Combine with _validateOptions on Refactor
  function _validateFetchOptions(options){
    var errorMsg;
    if(!_isObject(options)){
      errorMsg = `options argument must be an Object. Instead, got ${options}.`;
    } else if(typeof options.then === 'undefined'){
      errorMsg = `options.then is required with fetch`;
    } else if (typeof options.then !== 'function'){
      errorMsg = `options.then must be a function.`;
    } else if(options.onConnectionLoss && typeof options.onConnectionLoss !== 'function'){
      errorMsg = 'options.onConnectionLoss must be a function'
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_OPTIONS");
    }
  };

  //Combine with Validate Options on Refactor
  function _validatePostOptions(options){
    var errorMsg;
    if(!_isObject(options)){
      errorMsg = `options argument must be an object.`;
    } else if (options.then && typeof options.then !== 'function'){
      errorMsg = `options.then must be a function. Instead, got ${options.then}.`;
    } else if(typeof options.data === 'undefined'){
      errorMsg = `data property cannot be undefined.`
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_OPTIONS");
    }
  }

  function _fetch(endpoint, options){
    _validateEndpoint(endpoint);
    _validateFetchOptions(options);
    ref.child(endpoint).once('value', (snapshot) => {
      if(options.asArray === true){
        //should call with context since they might setState
        options.then(_toArray(snapshot.val()));
      } else {
        options.then(snapshot.val());
      }
    }, options.onConnectionLoss);
  };

  function _setState(newState){
    this.setState(newState);
  };

  function _post(endpoint, options){
    _validateEndpoint(endpoint);
    _validatePostOptions(options);
    if(options.then){
      ref.child(endpoint).set(options.data, options.then);
    } else {
      ref.child(endpoint).set(options.data);
    }
  }

  function _addListener(endpoint, invoker, ref, options){
    firebaseListeners[endpoint][invoker] = ref.child(endpoint).on('value', (snapshot) => {
      var data = snapshot.val() || (options.asArray === true ? [] : {});
      if(options.then){
        options.asArray === true ? options.then.call(options.context, _toArray(data)) : options.then.call(options.context, data);
      } else {
        if(options.state){
          var newState = {};
          options.asArray === true ? newState[options.state] = _toArray(data) : newState[options.state] = data;
          _setState.call(options.context, newState);
        } else {
          _setState.call(options.context, data);
        }
      }
    }, options.onConnectionLoss);
  }

  function _endpointMixin(endpoint, invoker, ref){
    var flag = false;
    if(!_isObject(firebaseRefs[endpoint])){
      firebaseRefs[endpoint] = {
        [invoker]: ref.ref()
      };
      firebaseListeners[endpoint] = {};
      flag = true;
    } else if(!firebaseRefs[endpoint][invoker]){
      firebaseRefs[endpoint][invoker] = ref.ref();
      flag = true;
    } else {
      _throwError(`Endpoint (${endpoint}) already has listener ${invoker}`, "INVALID_ENDPOINT");
    }
    return flag;
  };

  function _bind(endpoint, options, invoker){
    _validateEndpoint(endpoint);
    //REFACTOR
    if(invoker === 'listenTo'){
      _validateListenToOptions(options);
    } else {
      _validateOptions(options, invoker);
    }
    var flag = _endpointMixin(endpoint, invoker, ref);
    flag && _addListener(endpoint, invoker, ref, options);
    return  _returnRef(endpoint, invoker);
  };

  function _sync(endpoint, options){
    _validateEndpoint(endpoint);
    _validateOptions(options);

    var context = options.context;
    var reactSetState = context.setState
    var flag = _endpointMixin(endpoint, 'syncState', ref);
    if(flag === true){
      firebaseListeners[endpoint].syncState = ref.child(endpoint).on('value', (snapshot) => {
        var data = snapshot.val();
        if(data === null){
          reactSetState.call(context, {[options.state]: options.asArray === true ? [] : {}});
        } else {
          data = options.asArray === true ? _toArray(data) : data;
          reactSetState.call(context, {[options.state]: data});
        }
      });
    }

    context.setState = function (data) {
      for (var key in data) {
        if (key === options.state) {
          _updateSyncState(ref.child(endpoint), data[key], key)
       } else {
         reactSetState.call(options.context, data);
       }
     }
   };

   return _returnRef(endpoint, 'syncState');

    function _updateSyncState(ref, data, key){
      if(_isObject(data)) {
        for(var prop in data){
          _updateSyncState(ref.child(prop), data[prop], prop);
        }
      } else {
        ref.set(data);
      }
    };
  };

  function _returnRef(endpoint, method){
    return { endpoint, method };
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
