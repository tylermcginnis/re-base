(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("firebase"));
	else if(typeof define === 'function' && define.amd)
		define(["firebase"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("firebase")) : factory(root["Firebase"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	module.exports = (function () {
	  var firebase = __webpack_require__(2);
	  var Map = __webpack_require__(3);
	  var WeakMap = __webpack_require__(61);
	  var firebaseApp = null;
	  var rebase;
	  var firebaseRefs = new Map();
	  var firebaseListeners = new Map();
	  var syncs = new WeakMap();

	  var optionValidators = {
	    notObject: function notObject(options) {
	      if (!_isObject(options)) {
	        _throwError('The options argument must be an object. Instead, got ' + options, 'INVALID_OPTIONS');
	      }
	    },
	    context: function context(options) {
	      this.notObject(options);
	      if (!options.context || !_isObject(options.context)) {
	        this.makeError('context', 'object', options.context);
	      }
	    },
	    state: function state(options) {
	      this.notObject(options);
	      if (!options.state || typeof options.state !== 'string') {
	        this.makeError('state', 'string', options.state);
	      }
	    },
	    then: function then(options) {
	      this.notObject(options);
	      if (typeof options.then === 'undefined' || typeof options.then !== 'function') {
	        this.makeError('then', 'function', options.then);
	      }
	    },
	    data: function data(options) {
	      this.notObject(options);
	      if (typeof options.data === 'undefined') {
	        this.makeError('data', 'ANY', options.data);
	      }
	    },
	    query: function query(options) {
	      this.notObject(options);
	      var validQueries = ['limitToFirst', 'limitToLast', 'orderByChild', 'orderByValue', 'orderByKey', 'orderByPriority', 'startAt', 'endAt', 'equalTo'];
	      var queries = options.queries;
	      for (var key in queries) {
	        if (queries.hasOwnProperty(key) && validQueries.indexOf(key) === -1) {
	          _throwError('The query field must contain valid Firebase queries.  Expected one of [' + validQueries.join(', ') + ']. Instead, got ' + key, 'INVALID_OPTIONS');
	        }
	      }
	    },
	    makeError: function makeError(prop, type, actual) {
	      _throwError('The options argument must contain a ' + prop + ' property of type ' + type + '. Instead, got ' + actual, 'INVALID_OPTIONS');
	    }
	  };

	  function _toArray(snapshot) {
	    var arr = [];
	    snapshot.forEach(function (childSnapshot) {
	      var val = childSnapshot.val();
	      if (_isObject(val)) {
	        val.key = childSnapshot.key;
	      }
	      arr.push(val);
	    });
	    return arr;
	  };

	  function _isObject(obj) {
	    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
	  };

	  function _throwError(msg, code) {
	    var err = new Error('REBASE: ' + msg);
	    err.code = code;
	    throw err;
	  };

	  function _validateConfig(config) {
	    var defaultError = 'Rebase.createClass failed.';
	    var errorMsg;
	    if (typeof config !== 'object') {
	      errorMsg = defaultError + ' to migrate from 2.x.x to 3.x.x, the config must be an object. See: https://firebase.google.com/docs/web/setup#add_firebase_to_your_app';
	    } else if (!config || arguments.length > 1) {
	      errorMsg = defaultError + ' expects 1 argument.';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, "INVALID_CONFIG");
	    }
	  };

	  function _validateEndpoint(endpoint) {
	    var defaultError = 'The Firebase endpoint you are trying to listen to';
	    var errorMsg;
	    if (typeof endpoint !== 'string') {
	      errorMsg = defaultError + ' must be a string. Instead, got ' + endpoint;
	    } else if (endpoint.length === 0) {
	      errorMsg = defaultError + ' must be a non-empty string. Instead, got ' + endpoint;
	    } else if (endpoint.length > 768) {
	      errorMsg = defaultError + ' is too long to be stored in Firebase. It must be less than 768 characters.';
	    } else if (/^$|[\[\]\#\$]|.{1}[\.]/.test(endpoint)) {
	      errorMsg = defaultError + ' in invalid. Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]".';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, "INVALID_ENDPOINT");
	    }
	  };

	  function _setState(newState) {
	    this.setState(newState);
	  };

	  function _returnRef(endpoint, method, id, context) {
	    return { endpoint: endpoint, method: method, id: id, context: context };
	  };

	  function _addSync(context, id, sync) {
	    var existingSyncs = syncs.get(context) || [];
	    existingSyncs.push(sync);
	    syncs.set(context, existingSyncs);
	  }
	  function _fetch(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.context(options);
	    options.queries && optionValidators.query(options);
	    var ref = firebase.database().ref(endpoint);
	    ref = _addQueries(ref, options.queries);
	    return ref.once('value').then(function (snapshot) {
	      var data = options.asArray === true ? _toArray(snapshot) : snapshot.val();
	      if (options.then) {
	        options.then.call(options.context, data);
	      }
	      return data;
	    }, function (err) {
	      //call onFailure callback if it exists otherwise return a rejected promise
	      if (options.onFailure && typeof options.onFailure === 'function') {
	        options.onFailure.call(options.context, err);
	      } else {
	        return firebase.Promise.reject(err);
	      }
	    });
	  };

	  function _firebaseRefsMixin(id, ref) {
	    firebaseRefs.set(id, ref);
	  };

	  function _addListener(id, invoker, options, ref) {
	    ref = _addQueries(ref, options.queries);
	    firebaseListeners.set(id, ref.on('value', function (snapshot) {
	      var data = snapshot.val();
	      data = data === null ? options.asArray === true ? [] : {} : data;
	      if (invoker === 'listenTo') {
	        options.asArray === true ? options.then.call(options.context, _toArray(snapshot)) : options.then.call(options.context, data);
	      } else if (invoker === 'syncState') {
	        data = options.asArray === true ? _toArray(snapshot) : data;
	        options.reactSetState.call(options.context, _defineProperty({}, options.state, data));
	        if (options.then && options.then.called === false) {
	          options.then.call(options.context);
	          options.then.called = true;
	        }
	      } else if (invoker === 'bindToState') {
	        var newState = {};
	        options.asArray === true ? newState[options.state] = _toArray(snapshot) : newState[options.state] = data;
	        _setState.call(options.context, newState);
	        if (options.then && options.then.called === false) {
	          options.then.call(options.context);
	          options.then.called = true;
	        }
	      }
	    }));
	  };

	  function _bind(endpoint, options, invoker) {
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
	    return _returnRef(endpoint, invoker, id, options.context);
	  };

	  function _updateSyncState(ref, data) {
	    if (_isObject(data)) {
	      for (var prop in data) {
	        //allow timestamps to be set
	        if (prop !== '.sv') {
	          _updateSyncState(ref.child(prop), data[prop]);
	        } else {
	          ref.set(data);
	        }
	      }
	    } else {
	      ref.set(data);
	    }
	  };

	  function _sync(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.context(options);
	    optionValidators.state(options);
	    options.queries && optionValidators.query(options);
	    options.then && (options.then.called = false);

	    //store reference to react's setState
	    if (_sync.called !== true) {
	      _sync.reactSetState = options.context.setState;
	      _sync.called = true;
	    }
	    options.reactSetState = _sync.reactSetState;

	    var ref = firebase.database().ref(endpoint);
	    var id = _createHash(endpoint, 'syncState');
	    _firebaseRefsMixin(id, ref);
	    _addListener(id, 'syncState', options, ref);

	    var sync = {
	      id: id,
	      updateFirebase: _updateSyncState.bind(this, ref),
	      stateKey: options.state
	    };
	    _addSync(options.context, id, sync);

	    options.context.setState = function (data, cb) {
	      var _this = this;

	      var syncsToCall = syncs.get(this);
	      syncsToCall.forEach(function (sync) {
	        for (var key in data) {
	          if (data.hasOwnProperty(key)) {
	            if (key === sync.stateKey) {
	              sync.updateFirebase(data[key]);
	            } else {
	              _sync.reactSetState.call(_this, data, cb);
	            }
	          }
	        }
	      });
	    };
	    return _returnRef(endpoint, 'syncState', id, options.context);
	  };

	  function _post(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.data(options);
	    var ref = firebase.database().ref(endpoint);
	    if (options.then) {
	      return ref.set(options.data, options.then);
	    } else {
	      return ref.set(options.data);
	    }
	  };

	  function _update(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.data(options);
	    var ref = firebase.database().ref(endpoint);
	    if (options.then) {
	      return ref.update(options.data, options.then);
	    } else {
	      return ref.update(options.data);
	    }
	  };

	  function _push(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.data(options);
	    var ref = firebase.database().ref(endpoint);
	    var returnEndpoint;
	    if (options.then) {
	      returnEndpoint = ref.push(options.data, options.then);
	    } else {
	      returnEndpoint = ref.push(options.data);
	    }
	    return returnEndpoint;
	  };

	  function _addQueries(ref, queries) {
	    var needArgs = {
	      limitToFirst: true,
	      limitToLast: true,
	      orderByChild: true,
	      startAt: true,
	      endAt: true,
	      equalTo: true
	    };
	    for (var key in queries) {
	      if (queries.hasOwnProperty(key)) {
	        if (needArgs[key]) {
	          ref = ref[key](queries[key]);
	        } else {
	          ref = ref[key]();
	        }
	      }
	    }
	    return ref;
	  };

	  function _removeBinding(_ref) {
	    var endpoint = _ref.endpoint;
	    var method = _ref.method;
	    var id = _ref.id;
	    var context = _ref.context;

	    var ref = firebaseRefs.get(id);
	    var listener = firebaseListeners.get(id);
	    if (typeof ref === "undefined") {
	      var errorMsg = 'Unexpected value. Ref was either never bound or has already been unbound.';
	      _throwError(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
	    }
	    ref.off('value', listener);
	    firebaseRefs['delete'](id);
	    firebaseListeners['delete'](id);
	    var currentSyncs = syncs.get(context);
	    if (currentSyncs && currentSyncs.length > 0) {
	      var idx = currentSyncs.findIndex(function (item, index) {
	        return item.id === id;
	      });
	      if (idx !== -1) {
	        currentSyncs.splice(idx, 1);
	        syncs.set(context, currentSyncs);
	      }
	    }
	  };

	  function _reset() {
	    rebase = undefined;
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = firebaseRefs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var _step$value = _slicedToArray(_step.value, 2);

	        var id = _step$value[0];
	        var ref = _step$value[1];

	        ref.off('value', firebaseListeners.get(id));
	        firebaseRefs = new Map();
	        firebaseListeners = new Map();
	        syncs = new WeakMap();
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  };

	  function _authWithPassword(credentials, fn) {
	    var ref = firebase.auth();
	    var email = credentials.email;
	    var password = credentials.password;

	    return ref.signInWithEmailAndPassword(email, password).then(function (authData) {
	      return fn(null, authData);
	    })['catch'](function (err) {
	      return fn(err);
	    });
	  }

	  function _authWithCustomToken(token, fn) {
	    var ref = firebase.auth();
	    return ref.signInWithCustomToken(token).then(function (user) {
	      return fn(null, user);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  }

	  function _authWithOAuthPopup(provider, fn, settings) {
	    settings = settings || {};
	    var authProvider = _getAuthProvider(provider, settings);
	    var ref = firebase.auth();
	    return ref.signInWithPopup(authProvider).then(function (authData) {
	      return fn(null, authData);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  }

	  function _getOAuthRedirectResult(fn) {
	    var ref = firebase.auth();
	    return ref.getRedirectResult().then(function (user) {
	      return fn(null, user);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  }

	  function _authWithOAuthToken(provider, token, fn, settings) {
	    settings = settings || {};
	    var authProvider = _getAuthProvider(provider, settings);
	    var credential = authProvider.credential.apply(authProvider, [token].concat(_toConsumableArray(settings.providerOptions)));
	    var ref = firebase.auth();
	    return ref.signInWithCredential(credential).then(function (authData) {
	      return fn(null, authData);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  }

	  function _authWithOAuthRedirect(provider, fn, settings) {
	    settings = settings || {};
	    var authProvider = _getAuthProvider(provider, settings);
	    var ref = firebase.auth();
	    return ref.signInWithRedirect(authProvider).then(function () {
	      return fn(null);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  }

	  function _onAuth(fn) {
	    var ref = firebase.auth();
	    return ref.onAuthStateChanged(fn);
	  }

	  function _unauth() {
	    var ref = firebase.auth();
	    return ref.signOut();
	  }

	  function _getAuth() {
	    var ref = firebase.auth();
	    return ref.currentUser;
	  }

	  function _createUser(credentials, fn) {
	    var ref = firebase.auth();
	    var email = credentials.email;
	    var password = credentials.password;

	    return ref.createUserWithEmailAndPassword(email, password).then(function (authData) {
	      return fn(null, authData);
	    })['catch'](function (err) {
	      return fn(err);
	    });
	  };

	  function _resetPassword(credentials, fn) {
	    var ref = firebase.auth();
	    var email = credentials.email;

	    return ref.sendPasswordResetEmail(email).then(function () {
	      return fn(null);
	    })['catch'](function (error) {
	      return fn(error);
	    });
	  };

	  function _getFacebookProvider(settings) {
	    var provider = new firebase.auth.FacebookAuthProvider();
	    if (settings.scope) {
	      provider = _addScope(settings.scope, provider);
	    }
	    return provider;
	  }

	  function _getTwitterProvider() {
	    return new firebase.auth.TwitterAuthProvider();
	  }

	  function _getGithubProvider(settings) {
	    var provider = new firebase.auth.GithubAuthProvider();
	    if (settings.scope) {
	      provider = _addScope(settings.scope, provider);
	    }
	    return provider;
	  };

	  function _getGoogleProvider(settings) {
	    var provider = new firebase.auth.GoogleAuthProvider();
	    if (settings.scope) {
	      provider = _addScope(settings.scope, provider);
	    }
	    return provider;
	  };

	  function _addScope(scope, provider) {
	    if (Array.isArray(scope)) {
	      scope.forEach(function (item) {
	        provider.addScope(item);
	      });
	    } else {
	      provider.addScope(scope);
	    }
	    return provider;
	  }

	  function _createHash(endpoint, invoker) {
	    var hash = 0;
	    var str = endpoint + invoker + Date.now();
	    if (str.length == 0) return hash;
	    for (var i = 0; i < str.length; i++) {
	      var char = str.charCodeAt(i);
	      hash = (hash << 5) - hash + char;
	      hash = hash & hash;
	    }
	    return hash;
	  }

	  function _getAuthProvider(service, settings) {
	    switch (service) {
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
	        _throwError('Expected auth provider requested. Available auth providers: facebook,twitter,github, google', 'UNKNOWN AUTH PROVIDER');
	        break;
	    }
	  }

	  function init() {
	    return {
	      storage: firebase.storage,
	      database: firebase.database,
	      auth: firebase.auth,
	      app: firebase.app,
	      listenTo: function listenTo(endpoint, options) {
	        return _bind(endpoint, options, 'listenTo');
	      },
	      bindToState: function bindToState(endpoint, options) {
	        return _bind(endpoint, options, 'bindToState');
	      },
	      syncState: function syncState(endpoint, options) {
	        return _sync(endpoint, options);
	      },
	      fetch: function fetch(endpoint, options) {
	        return _fetch(endpoint, options);
	      },
	      post: function post(endpoint, options) {
	        return _post(endpoint, options);
	      },
	      update: function update(endpoint, options) {
	        return _update(endpoint, options);
	      },
	      push: function push(endpoint, options) {
	        return _push(endpoint, options);
	      },
	      removeBinding: function removeBinding(endpoint) {
	        _removeBinding(endpoint, true);
	      },
	      reset: function reset() {
	        _reset();
	      },
	      authWithPassword: function authWithPassword(credentials, fn) {
	        return _authWithPassword(credentials, fn);
	      },
	      authWithCustomToken: function authWithCustomToken(token, fn) {
	        return _authWithCustomToken(token, fn);
	      },
	      authWithOAuthPopup: function authWithOAuthPopup(provider, fn, settings) {
	        return _authWithOAuthPopup(provider, fn, settings);
	      },
	      authWithOAuthRedirect: function authWithOAuthRedirect(provider, fn, settings) {
	        return _authWithOAuthRedirect(provider, fn, settings);
	      },
	      authWithOAuthToken: function authWithOAuthToken(provider, token, fn, settings) {
	        return _authWithOAuthToken(provider, token, fn, settings);
	      },
	      authGetOAuthRedirectResult: function authGetOAuthRedirectResult(fn) {
	        return _getOAuthRedirectResult(fn);
	      },
	      onAuth: function onAuth(fn) {
	        return _onAuth(fn);
	      },
	      unauth: function unauth(fn) {
	        return _unauth();
	      },
	      getAuth: function getAuth() {
	        return _getAuth();
	      },
	      createUser: function createUser(credentials, fn) {
	        return _createUser(credentials, fn);
	      },
	      resetPassword: function resetPassword(credentials, fn) {
	        return _resetPassword(credentials, fn);
	      }
	    };
	  };

	  return {
	    createClass: function createClass(config) {
	      if (rebase) {
	        return rebase;
	      }
	      if (!firebaseApp) {
	        _validateConfig(config);
	        firebaseApp = firebase.initializeApp(config);
	      }
	      rebase = init();
	      return rebase;
	    }
	  };
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(4)() ? Map : __webpack_require__(5);


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var map, iterator, result;
		if (typeof Map !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
		} catch (e) {
			return false;
		}
		if (String(map) !== '[object Map]') return false;
		if (map.size !== 3) return false;
		if (typeof map.clear !== 'function') return false;
		if (typeof map.delete !== 'function') return false;
		if (typeof map.entries !== 'function') return false;
		if (typeof map.forEach !== 'function') return false;
		if (typeof map.get !== 'function') return false;
		if (typeof map.has !== 'function') return false;
		if (typeof map.keys !== 'function') return false;
		if (typeof map.set !== 'function') return false;
		if (typeof map.values !== 'function') return false;

		iterator = map.entries();
		result = iterator.next();
		if (result.done !== false) return false;
		if (!result.value) return false;
		if (result.value[0] !== 'raz') return false;
		if (result.value[1] !== 'one') return false;

		return true;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear          = __webpack_require__(6)
	  , eIndexOf       = __webpack_require__(8)
	  , setPrototypeOf = __webpack_require__(14)
	  , callable       = __webpack_require__(19)
	  , validValue     = __webpack_require__(7)
	  , d              = __webpack_require__(20)
	  , ee             = __webpack_require__(32)
	  , Symbol         = __webpack_require__(33)
	  , iterator       = __webpack_require__(38)
	  , forOf          = __webpack_require__(47)
	  , Iterator       = __webpack_require__(57)
	  , isNative       = __webpack_require__(60)

	  , call = Function.prototype.call
	  , defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf
	  , MapPoly;

	module.exports = MapPoly = function (/*iterable*/) {
		var iterable = arguments[0], keys, values, self;
		if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf && (Map !== MapPoly)) {
			self = setPrototypeOf(new Map(), getPrototypeOf(this));
		} else {
			self = this;
		}
		if (iterable != null) iterator(iterable);
		defineProperties(self, {
			__mapKeysData__: d('c', keys = []),
			__mapValuesData__: d('c', values = [])
		});
		if (!iterable) return self;
		forOf(iterable, function (value) {
			var key = validValue(value)[0];
			value = value[1];
			if (eIndexOf.call(keys, key) !== -1) return;
			keys.push(key);
			values.push(value);
		}, self);
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
		MapPoly.prototype = Object.create(Map.prototype, {
			constructor: d(MapPoly)
		});
	}

	ee(defineProperties(MapPoly.prototype, {
		clear: d(function () {
			if (!this.__mapKeysData__.length) return;
			clear.call(this.__mapKeysData__);
			clear.call(this.__mapValuesData__);
			this.emit('_clear');
		}),
		delete: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return false;
			this.__mapKeysData__.splice(index, 1);
			this.__mapValuesData__.splice(index, 1);
			this.emit('_delete', index, key);
			return true;
		}),
		entries: d(function () { return new Iterator(this, 'key+value'); }),
		forEach: d(function (cb/*, thisArg*/) {
			var thisArg = arguments[1], iterator, result;
			callable(cb);
			iterator = this.entries();
			result = iterator._next();
			while (result !== undefined) {
				call.call(cb, thisArg, this.__mapValuesData__[result],
					this.__mapKeysData__[result], this);
				result = iterator._next();
			}
		}),
		get: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return;
			return this.__mapValuesData__[index];
		}),
		has: d(function (key) {
			return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
		}),
		keys: d(function () { return new Iterator(this, 'key'); }),
		set: d(function (key, value) {
			var index = eIndexOf.call(this.__mapKeysData__, key), emit;
			if (index === -1) {
				index = this.__mapKeysData__.push(key) - 1;
				emit = true;
			}
			this.__mapValuesData__[index] = value;
			if (emit) this.emit('_add', index, key);
			return this;
		}),
		size: d.gs(function () { return this.__mapKeysData__.length; }),
		values: d(function () { return new Iterator(this, 'value'); }),
		toString: d(function () { return '[object Map]'; })
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
		return this.entries();
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear

	'use strict';

	var value = __webpack_require__(7);

	module.exports = function () {
		value(this).length = 0;
		return this;
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPosInt = __webpack_require__(9)
	  , value    = __webpack_require__(7)

	  , indexOf = Array.prototype.indexOf
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (searchElement/*, fromIndex*/) {
		var i, l, fromIndex, val;
		if (searchElement === searchElement) { //jslint: ignore
			return indexOf.apply(this, arguments);
		}

		l = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;
		else if (fromIndex >= 0) fromIndex = floor(fromIndex);
		else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

		for (i = fromIndex; i < l; ++i) {
			if (hasOwnProperty.call(this, i)) {
				val = this[i];
				if (val !== val) return i; //jslint: ignore
			}
		}
		return -1;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(10)

	  , max = Math.max;

	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sign = __webpack_require__(11)

	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(12)()
		? Math.sign
		: __webpack_require__(13);


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(15)()
		? Object.setPrototypeOf
		: __webpack_require__(16);


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var create = Object.create, getPrototypeOf = Object.getPrototypeOf
	  , x = {};

	module.exports = function (/*customCreate*/) {
		var setPrototypeOf = Object.setPrototypeOf
		  , customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== 'function') return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554

	'use strict';

	var isObject      = __webpack_require__(17)
	  , value         = __webpack_require__(7)

	  , isPrototypeOf = Object.prototype.isPrototypeOf
	  , defineProperty = Object.defineProperty
	  , nullDesc = { configurable: true, enumerable: false, writable: true,
			value: undefined }
	  , validate;

	validate = function (obj, prototype) {
		value(obj);
		if ((prototype === null) || isObject(prototype)) return obj;
		throw new TypeError('Prototype must be null or an object');
	};

	module.exports = (function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, 'level', { configurable: false,
			enumerable: false, writable: false, value: status.level });
	}((function () {
		var x = Object.create(null), y = {}, set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(x, y);
			} catch (ignore) { }
			if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
		}

		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 2 };

		x = {};
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 1 };

		return false;
	}())));

	__webpack_require__(18);


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var map = { function: true, object: true };

	module.exports = function (x) {
		return ((x != null) && map[typeof x]) || false;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

	'use strict';

	var create = Object.create, shim;

	if (!__webpack_require__(15)()) {
		shim = __webpack_require__(16);
	}

	module.exports = (function () {
		var nullObject, props, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;

		nullObject = {};
		props = {};
		desc = { configurable: false, enumerable: false, writable: true,
			value: undefined };
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === '__proto__') {
				props[name] = { configurable: true, enumerable: false, writable: true,
					value: undefined };
				return;
			}
			props[name] = desc;
		});
		Object.defineProperties(nullObject, props);

		Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
			enumerable: false, writable: false, value: nullObject });

		return function (prototype, props) {
			return create((prototype === null) ? nullObject : prototype, props);
		};
	}());


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(21)
	  , normalizeOpts = __webpack_require__(27)
	  , isCallable    = __webpack_require__(28)
	  , contains      = __webpack_require__(29)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(22)()
		? Object.assign
		: __webpack_require__(23);


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(24)
	  , value = __webpack_require__(7)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(25)()
		? Object.keys
		: __webpack_require__(26);


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(30)()
		? String.prototype.contains
		: __webpack_require__(31);


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(20)
	  , callable = __webpack_require__(19)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(34)() ? Symbol : __webpack_require__(35);


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(20)
	  , validateSymbol = __webpack_require__(36)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(37);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isIterable = __webpack_require__(39);

	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(40)
	  , isString       = __webpack_require__(41)
	  , iteratorSymbol = __webpack_require__(42).iterator

	  , isArray = Array.isArray;

	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		if (isArguments(value)) return true;
		return (typeof value[iteratorSymbol] === 'function');
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call((function () { return arguments; }()));

	module.exports = function (x) { return (toString.call(x) === id); };


/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call('');

	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(43)() ? Symbol : __webpack_require__(44);


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(20)
	  , validateSymbol = __webpack_require__(45)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(46);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(40)
	  , callable    = __webpack_require__(19)
	  , isString    = __webpack_require__(41)
	  , get         = __webpack_require__(48)

	  , isArray = Array.isArray, call = Function.prototype.call
	  , some = Array.prototype.some;

	module.exports = function (iterable, cb/*, thisArg*/) {
		var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
		if (isArray(iterable) || isArguments(iterable)) mode = 'array';
		else if (isString(iterable)) mode = 'string';
		else iterable = get(iterable);

		callable(cb);
		doBreak = function () { broken = true; };
		if (mode === 'array') {
			some.call(iterable, function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if ((i + 1) < l) {
					code = char.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();

		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(40)
	  , isString       = __webpack_require__(41)
	  , ArrayIterator  = __webpack_require__(49)
	  , StringIterator = __webpack_require__(56)
	  , iterable       = __webpack_require__(38)
	  , iteratorSymbol = __webpack_require__(42).iterator;

	module.exports = function (obj) {
		if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
		if (isArguments(obj)) return new ArrayIterator(obj);
		if (isString(obj)) return new StringIterator(obj);
		return new ArrayIterator(obj);
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf = __webpack_require__(14)
	  , contains       = __webpack_require__(29)
	  , d              = __webpack_require__(20)
	  , Iterator       = __webpack_require__(50)

	  , defineProperty = Object.defineProperty
	  , ArrayIterator;

	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else if (contains.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () { return '[object Array Iterator]'; })
	});


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear    = __webpack_require__(6)
	  , assign   = __webpack_require__(21)
	  , callable = __webpack_require__(19)
	  , value    = __webpack_require__(7)
	  , d        = __webpack_require__(20)
	  , autoBind = __webpack_require__(51)
	  , Symbol   = __webpack_require__(42)

	  , defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , Iterator;

	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};

	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () { return this._createResult(this._next()); }),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) { return this.__list__[i]; }),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () { return '[object Iterator]'; })
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));

	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var copy       = __webpack_require__(52)
	  , map        = __webpack_require__(53)
	  , callable   = __webpack_require__(19)
	  , validValue = __webpack_require__(7)

	  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , define;

	define = function (name, desc, bindTo) {
		var value = validValue(desc) && callable(desc.value), dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};

	module.exports = function (props/*, bindTo*/) {
		var bindTo = arguments[1];
		return map(props, function (desc, name) {
			return define(name, desc, bindTo);
		});
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(21)
	  , value  = __webpack_require__(7);

	module.exports = function (obj) {
		var copy = Object(value(obj));
		if (copy !== obj) return copy;
		return assign({}, obj);
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var callable = __webpack_require__(19)
	  , forEach  = __webpack_require__(54)

	  , call = Function.prototype.call;

	module.exports = function (obj, cb/*, thisArg*/) {
		var o = {}, thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, obj, index) {
			o[key] = call.call(cb, thisArg, value, key, obj, index);
		});
		return o;
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(55)('forEach');


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order

	'use strict';

	var callable = __webpack_require__(19)
	  , value    = __webpack_require__(7)

	  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
	  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

	module.exports = function (method, defVal) {
		return function (obj, cb/*, thisArg, compareFn*/) {
			var list, thisArg = arguments[2], compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);

			list = keys(obj);
			if (compareFn) {
				list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
			}
			if (typeof method !== 'function') method = list[method];
			return call.call(method, list, function (key, index) {
				if (!propertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

	'use strict';

	var setPrototypeOf = __webpack_require__(14)
	  , d              = __webpack_require__(20)
	  , Iterator       = __webpack_require__(50)

	  , defineProperty = Object.defineProperty
	  , StringIterator;

	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));

	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i], code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () { return '[object String Iterator]'; })
	});


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf    = __webpack_require__(14)
	  , d                 = __webpack_require__(20)
	  , Iterator          = __webpack_require__(50)
	  , toStringTagSymbol = __webpack_require__(33).toStringTag
	  , kinds             = __webpack_require__(58)

	  , defineProperties = Object.defineProperties
	  , unBind = Iterator.prototype._unBind
	  , MapIterator;

	MapIterator = module.exports = function (map, kind) {
		if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
		Iterator.call(this, map.__mapKeysData__, map);
		if (!kind || !kinds[kind]) kind = 'key+value';
		defineProperties(this, {
			__kind__: d('', kind),
			__values__: d('w', map.__mapValuesData__)
		});
	};
	if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

	MapIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(MapIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__values__[i];
			if (this.__kind__ === 'key') return this.__list__[i];
			return [this.__list__[i], this.__values__[i]];
		}),
		_unBind: d(function () {
			this.__values__ = null;
			unBind.call(this);
		}),
		toString: d(function () { return '[object Map Iterator]'; })
	});
	Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
		d('c', 'Map Iterator'));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(59)('key',
		'value', 'key+value');


/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	module.exports = function (arg/*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) { set[name] = true; });
		return set;
	};


/***/ },
/* 60 */
/***/ function(module, exports) {

	// Exports true if environment provides native `Map` implementation,
	// whatever that is.

	'use strict';

	module.exports = (function () {
		if (typeof Map === 'undefined') return false;
		return (Object.prototype.toString.call(new Map()) === '[object Map]');
	}());


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(62)() ? WeakMap : __webpack_require__(63);


/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var weakMap, x;
		if (typeof WeakMap !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			weakMap = new WeakMap([[x = {}, 'one'], [{}, 'two'], [{}, 'three']]);
		} catch (e) {
			return false;
		}
		if (String(weakMap) !== '[object WeakMap]') return false;
		if (typeof weakMap.set !== 'function') return false;
		if (weakMap.set({}, 1) !== weakMap) return false;
		if (typeof weakMap.delete !== 'function') return false;
		if (typeof weakMap.has !== 'function') return false;
		if (weakMap.get(x) !== 'one') return false;

		return true;
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf    = __webpack_require__(14)
	  , object            = __webpack_require__(64)
	  , value             = __webpack_require__(7)
	  , randomUniq        = __webpack_require__(65)
	  , d                 = __webpack_require__(20)
	  , getIterator       = __webpack_require__(48)
	  , forOf             = __webpack_require__(47)
	  , toStringTagSymbol = __webpack_require__(66).toStringTag
	  , isNative          = __webpack_require__(71)

	  , isArray = Array.isArray, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty, getPrototypeOf = Object.getPrototypeOf
	  , WeakMapPoly;

	module.exports = WeakMapPoly = function (/*iterable*/) {
		var iterable = arguments[0], self;
		if (!(this instanceof WeakMapPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf && (WeakMap !== WeakMapPoly)) {
			self = setPrototypeOf(new WeakMap(), getPrototypeOf(this));
		} else {
			self = this;
		}
		if (iterable != null) {
			if (!isArray(iterable)) iterable = getIterator(iterable);
		}
		defineProperty(self, '__weakMapData__', d('c', '$weakMap$' + randomUniq()));
		if (!iterable) return self;
		forOf(iterable, function (val) {
			value(val);
			self.set(val[0], val[1]);
		});
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(WeakMapPoly, WeakMap);
		WeakMapPoly.prototype = Object.create(WeakMap.prototype, {
			constructor: d(WeakMapPoly)
		});
	}

	Object.defineProperties(WeakMapPoly.prototype, {
		delete: d(function (key) {
			if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
				delete key[this.__weakMapData__];
				return true;
			}
			return false;
		}),
		get: d(function (key) {
			if (hasOwnProperty.call(object(key), this.__weakMapData__)) {
				return key[this.__weakMapData__];
			}
		}),
		has: d(function (key) {
			return hasOwnProperty.call(object(key), this.__weakMapData__);
		}),
		set: d(function (key, value) {
			defineProperty(object(key), this.__weakMapData__, d('c', value));
			return this;
		}),
		toString: d(function () { return '[object WeakMap]'; })
	});
	defineProperty(WeakMapPoly.prototype, toStringTagSymbol, d('c', 'WeakMap'));


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(17);

	module.exports = function (value) {
		if (!isObject(value)) throw new TypeError(value + " is not an Object");
		return value;
	};


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	var generated = Object.create(null)

	  , random = Math.random;

	module.exports = function () {
		var str;
		do { str = random().toString(36).slice(2); } while (generated[str]);
		return str;
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(67)() ? Symbol : __webpack_require__(68);


/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(20)
	  , validateSymbol = __webpack_require__(69)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(70);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 70 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ },
/* 71 */
/***/ function(module, exports) {

	// Exports true if environment provides native `WeakMap` implementation, whatever that is.

	'use strict';

	module.exports = (function () {
		if (typeof WeakMap !== 'function') return false;
		return (Object.prototype.toString.call(new WeakMap()) === '[object WeakMap]');
	}());


/***/ }
/******/ ])
});
;