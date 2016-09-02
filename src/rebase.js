module.exports = (function(){
  var firebase = require('firebase');

  var firebaseApp = null;
  var rebase;
  var firebaseRefs = new Map();
  var firebaseListeners = new Map();
  var syncs = new Map();

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

  function _toArray(snapshot){
    var arr = [];
    snapshot.forEach(function (childSnapshot){
      var val = childSnapshot.val();
      if(_isObject(val)){
        val.key = childSnapshot.key;
      }
      arr.push(val);
    });
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

  function _validateConfig(config){
    var defaultError = 'Rebase.createClass failed.';
    var errorMsg;
    if(typeof config !== 'object'){
      errorMsg = `${defaultError} to migrate from 2.x.x to 3.x.x, the config must be an object. See: https://firebase.google.com/docs/web/setup#add_firebase_to_your_app`;
    } else if(!config || arguments.length > 1){
      errorMsg = `${defaultError} expects 1 argument.`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_CONFIG");
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
      errorMsg = `${defaultError} is too long to be stored in Firebase. It must be less than 768 characters.`;
    } else if(/^$|[\[\]\#\$]|.{1}[\.]/.test(endpoint)){
      errorMsg = `${defaultError} in invalid. Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]".`;
    }

    if(typeof errorMsg !== 'undefined'){
      _throwError(errorMsg, "INVALID_ENDPOINT");
    }
  };

  function _setState(newState){
    this.setState(newState);
  };

  function _returnRef(id){
    return { id };
  };

  function _addSync(id, ref){
    syncs.set(id,ref);
  }
  function _fetch(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    optionValidators.then(options);
    options.queries && optionValidators.query(options);
    var ref = firebase.database().ref(endpoint);
    ref = _addQueries(ref, options.queries);
    ref.once('value', (snapshot) => {
      var data = options.asArray === true ? _toArray(snapshot) : snapshot.val();
      options.then.call(options.context, data);
    });
  };

  function _firebaseRefsMixin(id, ref){
    firebaseRefs.set(id, ref);
  };

  function _addListener(id, invoker, options, ref){
    ref = _addQueries(ref, options.queries);
    firebaseListeners.set(id, ref.on('value', (snapshot) => {
      var data = snapshot.val();
      data = data === null ? (options.asArray === true ? [] : {}) : data;
      if(invoker === 'listenTo'){
        options.asArray === true ? options.then.call(options.context, _toArray(snapshot)) : options.then.call(options.context, data);
      } else if(invoker === 'syncState'){
          data = options.asArray === true ? _toArray(snapshot) : data;
          options.reactSetState.call(options.context, {[options.state]: data});
          if(options.then && options.then.called === false){
            options.then.call(options.context);
            options.then.called = true;
          }
      } else if(invoker === 'bindToState') {
          var newState = {};
          options.asArray === true ? newState[options.state] = _toArray(snapshot) : newState[options.state] = data;
          _setState.call(options.context, newState);
          if(options.then && options.then.called === false){
            options.then.call(options.context);
            options.then.called = true;
          }
      }
    }));
  };

  function _bind(endpoint, options, invoker){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    invoker === 'listenTo' && optionValidators.then(options);
    invoker === 'bindToState' && optionValidators.state(options);
    options.queries && optionValidators.query(options);
    options.then && (options.then.called = false);
    var id = _createHash(endpoint, invoker);
    var ref = firebase.database().ref(endpoint);
    _firebaseRefsMixin(id, ref);
    _addListener(id, invoker, options, ref);
    return _returnRef(id);
  };

  function _updateSyncState(ref, data, id){
    var syncRef = syncs.get(id);
    if(_isObject(syncRef)){
        if(_isObject(data)) {
          for(var prop in data){
            //allow timestamps to be set
            if(prop !== '.sv'){
              _updateSyncState(ref.child(prop), data[prop], id);
            } else {
              ref.set(data);
            }
          }
        } else {
          ref.set(data);
        }
    }
  };

  function _sync(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.context(options);
    optionValidators.state(options);
    options.queries && optionValidators.query(options);

    options.reactSetState = options.context.setState;
    options.then && (options.then.called = false);

    var ref = firebase.database().ref(endpoint);
    var id = _createHash(endpoint, 'syncState');
    _firebaseRefsMixin(id, ref);
    _addListener(id, 'syncState', options, ref);
    _addSync(id, ref);

    options.context.setState = (function(options,ref){
      options.syncs = options.syncs || [];
      options.syncs.push(function (data, cb) {
        for (var key in data) {
          if (data.hasOwnProperty(key)){
            if (key === options.state) {
              _updateSyncState.call(this, ref, data[key], id);
            } else {
              options.reactSetState.call(options.context, data, cb);
            }
          }
        }
      });
      return function(data, cb){
        options.syncs.forEach(function(f){
          f(data,cb);
        });
      }
    })(options, ref);

    return _returnRef(id);

  };

  function _post(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.data(options);
    var ref = firebase.database().ref(endpoint);
    if(options.then){
      ref.set(options.data, options.then);
    } else {
      ref.set(options.data);
    }
  };

  function _update(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.data(options);
    var ref = firebase.database().ref(endpoint);
    if(options.then){
      ref.update(options.data, options.then);
    } else {
      ref.update(options.data);
    }
  };

  function _push(endpoint, options){
    _validateEndpoint(endpoint);
    optionValidators.data(options);
    var ref = firebase.database().ref(endpoint);
    var returnEndpoint;
    if(options.then){
      returnEndpoint = ref.push(options.data, options.then);
    } else {
      returnEndpoint = ref.push(options.data);
    }
    return returnEndpoint;
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

  function _removeBinding({ id }){
    var ref = firebaseRefs.get(id);
    var listener = firebaseListeners.get(id);
    if (typeof ref === "undefined") {
      var errorMsg = `Unexpected value. Ref was either never bound or has already been unbound.`;
      _throwError(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
    }
    ref.off('value', listener);
    firebaseRefs.delete(id);
    firebaseListeners.delete(id);
    syncs.delete(id);
  };

  function _reset(){
    rebase = undefined;
    for (var [id, ref] of firebaseRefs) {
      ref.off('value', firebaseListeners.get(id));
      firebaseRefs.delete(id);
      firebaseListeners.delete(id);
      syncs.delete(id);
    }
  };

  function _authWithPassword(credentials ,fn){
    var ref = firebase.auth();
    const { email, password } = credentials;
    return ref.signInWithEmailAndPassword(email, password).then(authData => {
      return fn(null, authData);
    }).catch(err => {
      return fn(err);
    });
  }

  function _authWithCustomToken(token, fn){
    var ref = firebase.auth();
    return ref.signInWithCustomToken(token).then((user) => {
      return fn(null, user);
    }).catch(error => {
      return fn(error);
    }); 
  }

  function _authWithOAuthPopup(provider, fn, settings){
    settings = settings || {};
    var authProvider = _getAuthProvider(provider, settings);
    var ref = firebase.auth();
    return ref.signInWithPopup(authProvider).then(authData => {
        return fn(null, authData);
    }).catch(error => {
        return fn(error);
    });
  }

  function _getOAuthRedirectResult(fn){
    var ref = firebase.auth();
    return ref.getRedirectResult().then((user) => {
        return fn(null, user);
    }).catch(error => {
        return fn(error);
    });
  }

  function _authWithOAuthToken(provider, token, fn, settings){
    settings = settings || {};
    var authProvider = _getAuthProvider(provider, settings);
    var credential = authProvider.credential(token, ...settings.providerOptions);
    var ref = firebase.auth();
    return ref.signInWithCredential(credential).then(authData => {
        return fn(null, authData);
    }).catch(error => {
        return fn(error);
    });
  }

  function _authWithOAuthRedirect(provider, fn, settings){
    settings = settings || {};
    var authProvider = _getAuthProvider(provider, settings);
    var ref = firebase.auth();
    return ref.signInWithRedirect(authProvider).then(() => {
        return fn(null);
    }).catch(error => {
        return fn(error);
    });
  }

  function _onAuth(fn){
    var ref = firebase.auth();
    return ref.onAuthStateChanged(fn);
  }

  function _unauth(){
    var ref = firebase.auth();
    return ref.signOut();
  }

  function _getAuth() {
    var ref = firebase.auth();
    return ref.currentUser;
  }

  function _createUser(credentials, fn){
    var ref = firebase.auth();
    const { email, password } = credentials;
    return ref.createUserWithEmailAndPassword(email,password).then(authData => {
      return fn(null, authData);
    }).catch(err => {
      return fn(err);
    });
  };

  function _resetPassword(credentials, fn){
    var ref = firebase.auth();
    const { email } = credentials;
    return ref.sendPasswordResetEmail(email).then(() => {
       return fn(null);
    }).catch(error => {
       return fn(error);
    });
  };

  function _getFacebookProvider(settings){
    var provider = new firebase.auth.FacebookAuthProvider();
    if(settings.scope){
      provider = _addScope(settings.scope, provider);
    }
    return provider;
  }

  function _getTwitterProvider(){
    return new firebase.auth.TwitterAuthProvider();
  }

  function _getGithubProvider(settings){
    var provider = new firebase.auth.GithubAuthProvider();
    if(settings.scope){
      provider = _addScope(settings.scope, provider);
    }
    return provider;
  };

  function _getGoogleProvider(settings){
    var provider = new firebase.auth.GoogleAuthProvider();
    if(settings.scope){
      provider = _addScope(settings.scope, provider);
    }
    return provider;
  };

  function _addScope(scope, provider){
    if(Array.isArray(scope)){
      scope.forEach(item => {
          provider.addScope(item);
      });
    } else {
        provider.addScope(scope);
    }
    return provider;
  }

  function _createHash(endpoint, invoker){
    var hash = 0;
    var str = endpoint + invoker + Date.now();
    if (str.length == 0) return hash;
     for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
  }

  function _getAuthProvider(service, settings){
    switch(service){
      case 'twitter':
        return _getTwitterProvider();
      break;
      case 'google':
        return _getGoogleProvider(settings);
      break;
      case 'facebook':
        return _getFacebookProvider(settings);
      break;
      case 'github':
        return _getGithubProvider(settings);
      break;
      default:
        _throwError('Expected auth provider requested. Available auth providers: facebook,twitter,github, google','UNKNOWN AUTH PROVIDER');
      break;
    }
  }

  function init(){
    return {
      storage : firebase.storage,
      database: firebase.database,
      auth: firebase.auth,
      app: firebase.app,
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
      update(endpoint, options){
        _update(endpoint, options);
      },
      push(endpoint, options){
        return _push(endpoint, options);
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
      authWithCustomToken(token, fn){
        return _authWithCustomToken(token, fn);
      },
      authWithOAuthPopup(provider, fn, settings){
        return _authWithOAuthPopup(provider, fn, settings);
      },
      authWithOAuthRedirect(provider, fn, settings){
        return _authWithOAuthRedirect(provider, fn, settings);
      },
      authWithOAuthToken(provider, token, fn, settings){
        return _authWithOAuthToken(provider, token, fn, settings);
      },
      authGetOAuthRedirectResult(fn){
         return _getOAuthRedirectResult(fn);
      },
      onAuth(fn){
        return _onAuth(fn);
      },
      unauth(fn){
        return _unauth();
      },
      getAuth() {
        return _getAuth();
      },
      createUser(credentials,fn) {
        return _createUser(credentials, fn);
      },
      resetPassword(credentials,fn) {
        return _resetPassword(credentials, fn);
      }
    }
  };

  return {
    createClass(config){
      if(rebase) {
        return rebase;
      }
      if(!firebaseApp){
        _validateConfig(config);
        firebaseApp = firebase.initializeApp(config);
      }
      rebase = init();
      return rebase;
    }
  };
})();
