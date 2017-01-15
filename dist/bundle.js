(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("firebase"));
	else if(typeof define === 'function' && define.amd)
		define(["firebase"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("firebase")) : factory(root["firebase"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
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

	var _utils = __webpack_require__(2);

	var _validators = __webpack_require__(3);

	var _push2 = __webpack_require__(4);

	var _push3 = _interopRequireDefault(_push2);

	var _fetch2 = __webpack_require__(5);

	var _fetch3 = _interopRequireDefault(_fetch2);

	var _post2 = __webpack_require__(7);

	var _post3 = _interopRequireDefault(_post2);

	var _sync2 = __webpack_require__(8);

	var _sync3 = _interopRequireDefault(_sync2);

	var _bind2 = __webpack_require__(9);

	var _bind3 = _interopRequireDefault(_bind2);

	var _update2 = __webpack_require__(10);

	var _update3 = _interopRequireDefault(_update2);

	var _reset2 = __webpack_require__(11);

	var _reset3 = _interopRequireDefault(_reset2);

	var _removeBinding2 = __webpack_require__(12);

	var _removeBinding3 = _interopRequireDefault(_removeBinding2);

	var _remove2 = __webpack_require__(13);

	var _remove3 = _interopRequireDefault(_remove2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = function () {

	  function init(db) {
	    return function () {
	      var firebaseRefs = new Map();
	      var firebaseListeners = new Map();
	      var syncs = new WeakMap();

	      return {
	        initializedApp: db.app,
	        listenTo: function listenTo(endpoint, options) {
	          return _bind3.default.call(this, endpoint, options, 'listenTo', {
	            db: db,
	            refs: firebaseRefs,
	            listeners: firebaseListeners,
	            syncs: syncs
	          });
	        },
	        bindToState: function bindToState(endpoint, options) {
	          return _bind3.default.call(this, endpoint, options, 'bindToState', {
	            db: db,
	            refs: firebaseRefs,
	            listeners: firebaseListeners
	          });
	        },
	        syncState: function syncState(endpoint, options) {
	          return _sync3.default.call(this, endpoint, options, {
	            db: db,
	            refs: firebaseRefs,
	            listeners: firebaseListeners,
	            syncs: syncs
	          });
	        },
	        fetch: function fetch(endpoint, options) {
	          return (0, _fetch3.default)(endpoint, options, db);
	        },
	        post: function post(endpoint, options) {
	          return (0, _post3.default)(endpoint, options, db);
	        },
	        update: function update(endpoint, options) {
	          return (0, _update3.default)(endpoint, options, {
	            db: db
	          });
	        },
	        push: function push(endpoint, options) {
	          return (0, _push3.default)(endpoint, options, db);
	        },
	        removeBinding: function removeBinding(endpoint) {
	          (0, _removeBinding3.default)(endpoint, {
	            refs: firebaseRefs,
	            listeners: firebaseListeners,
	            syncs: syncs
	          });
	        },
	        remove: function remove(endpoint, fn) {
	          return (0, _remove3.default)(endpoint, db, fn);
	        },
	        reset: function reset() {
	          return (0, _reset3.default)({
	            refs: firebaseRefs,
	            listeners: firebaseListeners,
	            syncs: syncs
	          });
	        }
	      };
	    }();
	  };

	  return {
	    createClass: function createClass(db) {
	      (0, _validators._validateDatabase)(db);
	      return init(db);
	    }
	  };
	}();

	//database
	//helpers

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var _isObject = function _isObject(obj) {
	  return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
	};

	var _toArray = function _toArray(snapshot) {
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

	var _prepareData = function _prepareData(snapshot) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var isNullable = options.isNullable,
	      asString = options.asString,
	      asArray = options.asArray;

	  var data = snapshot.val();
	  if (asString === true && data === null) return '';
	  if (isNullable === true && data === null) return null;
	  if (asArray === true) return _toArray(snapshot);
	  return data === null ? {} : data;
	};

	var _addSync = function _addSync(context, sync, syncs) {
	  var existingSyncs = syncs.get(context) || [];
	  existingSyncs.push(sync);
	  syncs.set(context, existingSyncs);
	};

	var _throwError = function _throwError(msg, code) {
	  var err = new Error('REBASE: ' + msg);
	  err.code = code;
	  throw err;
	};

	var _setState = function _setState(newState) {
	  this.setState(newState);
	};

	var _returnRef = function _returnRef(endpoint, method, id, context) {
	  return { endpoint: endpoint, method: method, id: id, context: context };
	};

	var _addQueries = function _addQueries(ref, queries) {
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

	var _createHash = function _createHash(endpoint, invoker) {
	  var hash = 0;
	  var str = endpoint + invoker + Date.now();
	  if (str.length == 0) return hash;
	  for (var i = 0; i < str.length; i++) {
	    var char = str.charCodeAt(i);
	    hash = (hash << 5) - hash + char;
	    hash = hash & hash;
	  }
	  return hash;
	};

	var _addScope = function _addScope(scope, provider) {
	  if (Array.isArray(scope)) {
	    scope.forEach(function (item) {
	      provider.addScope(item);
	    });
	  } else {
	    provider.addScope(scope);
	  }
	  return provider;
	};

	var _firebaseRefsMixin = function _firebaseRefsMixin(id, ref, refs) {
	  refs.set(id, ref);
	};

	var _handleError = function _handleError(onFailure, err) {
	  if (err && typeof onFailure === 'function') {
	    onFailure(err);
	  }
	};

	var _setData = function _setData(ref, data, handleError, keepKeys) {
	  if (Array.isArray(data) && keepKeys) {
	    var shouldConvertToObject = data.reduce(function (acc, curr) {
	      return acc ? acc : _isObject(curr) && curr.hasOwnProperty('key');
	    }, false);
	    if (shouldConvertToObject) {
	      data = data.reduce(function (acc, item) {
	        acc[item.key] = item;
	        return acc;
	      }, {});
	    }
	  }
	  ref.set(data, handleError);
	};

	var _updateSyncState = function _updateSyncState(ref, onFailure, keepKeys, data) {
	  if (_isObject(data)) {
	    for (var prop in data) {
	      //allow timestamps to be set
	      if (prop !== '.sv') {
	        _updateSyncState(ref.child(prop), onFailure, keepKeys, data[prop]);
	      } else {
	        _setData(ref, data, _handleError.bind(null, onFailure), keepKeys);
	      }
	    }
	  } else {
	    _setData(ref, data, _handleError.bind(null, onFailure), keepKeys);
	  }
	};

	var _addListener = function _addListener(id, invoker, options, ref, listeners) {
	  ref = _addQueries(ref, options.queries);
	  listeners.set(id, ref.on('value', function (snapshot) {
	    var data = _prepareData(snapshot, options);
	    if (invoker === 'listenTo') {
	      options.then.call(options.context, data);
	    } else if (invoker === 'syncState') {
	      options.reactSetState.call(options.context, _defineProperty({}, options.state, data));
	      if (options.then && options.then.called === false) {
	        options.then.call(options.context);
	        options.then.called = true;
	      }
	    } else if (invoker === 'bindToState') {
	      var newState = _defineProperty({}, options.state, data);
	      _setState.call(options.context, newState);
	      if (options.then && options.then.called === false) {
	        options.then.call(options.context);
	        options.then.called = true;
	      }
	    }
	  }, options.onFailure));
	};

	exports._addScope = _addScope;
	exports._createHash = _createHash;
	exports._addQueries = _addQueries;
	exports._returnRef = _returnRef;
	exports._setState = _setState;
	exports._throwError = _throwError;
	exports._prepareData = _prepareData;
	exports._toArray = _toArray;
	exports._isObject = _isObject;
	exports._addSync = _addSync;
	exports._firebaseRefsMixin = _firebaseRefsMixin;
	exports._updateSyncState = _updateSyncState;
	exports._addListener = _addListener;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._validateEndpoint = exports._validateDatabase = exports.optionValidators = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _utils = __webpack_require__(2);

	var optionValidators = {
	  notObject: function notObject(options) {
	    if (!(0, _utils._isObject)(options)) {
	      (0, _utils._throwError)('The options argument must be an object. Instead, got ' + options, 'INVALID_OPTIONS');
	    }
	  },
	  context: function context(options) {
	    this.notObject(options);
	    if (!options.context || !(0, _utils._isObject)(options.context)) {
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
	        (0, _utils._throwError)('The query field must contain valid Firebase queries.  Expected one of [' + validQueries.join(', ') + ']. Instead, got ' + key, 'INVALID_OPTIONS');
	      }
	    }
	  },
	  asString: function asString(options) {
	    this.notObject(options);
	    if (options.asString === true && (options.isNullable === true || options.asArray === true)) {
	      (0, _utils._throwError)('The asString option must not be used in conjuntion with the options isNullable or asArray', 'INVALID_OPTIONS');
	    }
	  },
	  makeError: function makeError(prop, type, actual) {
	    (0, _utils._throwError)('The options argument must contain a ' + prop + ' property of type ' + type + '. Instead, got ' + actual, 'INVALID_OPTIONS');
	  }
	};

	var _validateEndpoint = function _validateEndpoint(endpoint) {
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
	    (0, _utils._throwError)(errorMsg, "INVALID_ENDPOINT");
	  }
	};

	var _validateDatabase = function _validateDatabase(db) {
	  var defaultError = 'Rebase.createClass failed.';
	  var errorMsg;
	  if ((typeof db === 'undefined' ? 'undefined' : _typeof(db)) !== 'object' || !db.app) {
	    errorMsg = defaultError + ' Expected an initialized firebase database object.';
	  } else if (!db || arguments.length > 1) {
	    errorMsg = defaultError + ' expects 1 argument.';
	  }

	  if (typeof errorMsg !== 'undefined') {
	    (0, _utils._throwError)(errorMsg, "INVALID_CONFIG");
	  }
	};

	exports.optionValidators = optionValidators;
	exports._validateDatabase = _validateDatabase;
	exports._validateEndpoint = _validateEndpoint;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _push;

	var _validators = __webpack_require__(3);

	function _push(endpoint, options, db) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.data(options);
	  var ref = db.ref(endpoint);
	  var returnEndpoint;
	  if (options.then) {
	    returnEndpoint = ref.push(options.data, options.then);
	  } else {
	    returnEndpoint = ref.push(options.data);
	  }
	  return returnEndpoint;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fetch;

	var _validators = __webpack_require__(3);

	var _utils = __webpack_require__(2);

	var _firebase = __webpack_require__(6);

	function _fetch(endpoint, options, db) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.asString(options);
	  options.queries && _validators.optionValidators.query(options);
	  var ref = db.ref(endpoint);
	  ref = (0, _utils._addQueries)(ref, options.queries);
	  return ref.once('value').then(function (snapshot) {
	    var data = (0, _utils._prepareData)(snapshot, options);
	    if (options.then) {
	      options.then.call(options.context, data);
	    }
	    return data;
	  }, function (err) {
	    //call onFailure callback if it exists otherwise return a rejected promise
	    if (options.onFailure && typeof options.onFailure === 'function') {
	      options.onFailure.call(options.context, err);
	    } else {
	      return _firebase.Promise.reject(err);
	    }
	  });
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _post;

	var _validators = __webpack_require__(3);

	function _post(endpoint, options, db) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.data(options);
	  var ref = db.ref(endpoint);
	  if (options.then) {
	    return ref.set(options.data, options.then);
	  } else {
	    return ref.set(options.data);
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _sync;

	var _validators = __webpack_require__(3);

	var _utils = __webpack_require__(2);

	function _sync(endpoint, options, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.state(options);
	  _validators.optionValidators.asString(options);
	  options.queries && _validators.optionValidators.query(options);
	  options.then && (options.then.called = false);
	  options.onFailure = options.onFailure ? options.onFailure.bind(options.context) : function () {};
	  options.keepKeys = options.keepKeys && options.asArray;

	  //store reference to react's setState
	  if (_sync.called !== true) {
	    _sync.reactSetState = options.context.setState;
	    _sync.called = true;
	  }
	  options.reactSetState = _sync.reactSetState;

	  var ref = state.db.ref(endpoint);
	  var id = (0, _utils._createHash)(endpoint, 'syncState');
	  (0, _utils._firebaseRefsMixin)(id, ref, state.refs);
	  (0, _utils._addListener)(id, 'syncState', options, ref, state.listeners);

	  var sync = {
	    id: id,
	    updateFirebase: _utils._updateSyncState.bind(null, ref, options.onFailure, options.keepKeys),
	    stateKey: options.state
	  };
	  (0, _utils._addSync)(options.context, sync, state.syncs);

	  options.context.setState = function (data, cb) {
	    var syncsToCall = state.syncs.get(this);
	    //if sync does not exist, call original Component.setState
	    if (!syncsToCall || syncsToCall.length === 0) {
	      return _sync.reactSetState.call(this, data, cb);
	    }
	    var syncedKeys = syncsToCall.map(function (sync) {
	      return {
	        key: sync.stateKey,
	        update: sync.updateFirebase
	      };
	    });
	    syncedKeys.forEach(function (syncedKey) {
	      if (data.hasOwnProperty(syncedKey.key)) {
	        syncedKey.update(data[syncedKey.key]);
	      }
	    });
	    var allKeys = Object.keys(data);
	    allKeys.forEach(function (key) {
	      if (!syncedKeys.find(function (syncedKey) {
	        return syncedKey.key === key;
	      })) {
	        var update = {};
	        update[key] = data[key];
	        _sync.reactSetState.call(options.context, update, cb);
	      }
	    });
	  };
	  return (0, _utils._returnRef)(endpoint, 'syncState', id, options.context);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _bind;

	var _validators = __webpack_require__(3);

	var _utils = __webpack_require__(2);

	function _bind(endpoint, options, invoker, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.asString(options);
	  invoker === 'listenTo' && _validators.optionValidators.then(options);
	  invoker === 'bindToState' && _validators.optionValidators.state(options);
	  options.queries && _validators.optionValidators.query(options);
	  options.then && (options.then.called = false);

	  var id = (0, _utils._createHash)(endpoint, invoker);
	  var ref = state.db.ref(endpoint);
	  (0, _utils._firebaseRefsMixin)(id, ref, state.refs);
	  (0, _utils._addListener)(id, invoker, options, ref, state.listeners);
	  return (0, _utils._returnRef)(endpoint, invoker, id, options.context);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _update;

	var _validators = __webpack_require__(3);

	function _update(endpoint, options, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.data(options);
	  var ref = state.db.ref(endpoint);
	  if (options.then) {
	    return ref.update(options.data, options.then);
	  } else {
	    return ref.update(options.data);
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _reset;
	function _reset(state) {
	  state.refs.forEach(function (ref, id) {
	    ref.off('value', state.listeners.get(id));
	  });
	  state.listeners = new Map();
	  state.refs = new Map();
	  state.syncs = new WeakMap();
	  return null;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _removeBinding;

	var _utils = __webpack_require__(2);

	function _removeBinding(_ref, _ref2) {
	  var endpoint = _ref.endpoint,
	      method = _ref.method,
	      id = _ref.id,
	      context = _ref.context;
	  var refs = _ref2.refs,
	      listeners = _ref2.listeners,
	      syncs = _ref2.syncs;

	  var ref = refs.get(id);
	  var listener = listeners.get(id);
	  if (typeof ref === "undefined") {
	    var errorMsg = "Unexpected value. Ref was either never bound or has already been unbound.";
	    (0, _utils._throwError)(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
	  }
	  ref.off('value', listener);
	  refs.delete(id);
	  listeners.delete(id);
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

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (endpoint, db, fn) {
	  return db.ref().child(endpoint).remove(fn);
	};

/***/ }
/******/ ])
});
;