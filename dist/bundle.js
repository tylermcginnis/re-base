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
	  var Symbol = __webpack_require__(3);
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
	    optionValidators.then(options);
	    options.queries && optionValidators.query(options);
	    var ref = firebase.database().ref(endpoint);
	    ref = _addQueries(ref, options.queries);
	    ref.once('value', function (snapshot) {
	      var data = options.asArray === true ? _toArray(snapshot) : snapshot.val();
	      options.then.call(options.context, data);
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
	      ref.set(options.data, options.then);
	    } else {
	      ref.set(options.data);
	    }
	  };

	  function _update(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.data(options);
	    var ref = firebase.database().ref(endpoint);
	    if (options.then) {
	      ref.update(options.data, options.then);
	    } else {
	      ref.update(options.data);
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
	        _fetch(endpoint, options);
	      },
	      post: function post(endpoint, options) {
	        _post(endpoint, options);
	      },
	      update: function update(endpoint, options) {
	        _update(endpoint, options);
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

	module.exports = __webpack_require__(4)() ? Symbol : __webpack_require__(5);


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(6)
	  , validateSymbol = __webpack_require__(19)

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(7)
	  , normalizeOpts = __webpack_require__(14)
	  , isCallable    = __webpack_require__(15)
	  , contains      = __webpack_require__(16)

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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(8)()
		? Object.assign
		: __webpack_require__(9);


/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(10)
	  , value = __webpack_require__(13)

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(11)()
		? Object.keys
		: __webpack_require__(12);


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(17)()
		? String.prototype.contains
		: __webpack_require__(18);


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(20);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ }
/******/ ])
});
;