(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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

	var _validators = __webpack_require__(4);

	var _push2 = __webpack_require__(5);

	var _push3 = _interopRequireDefault(_push2);

	var _fetch2 = __webpack_require__(6);

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

	var _removeBinding2 = __webpack_require__(3);

	var _removeBinding3 = _interopRequireDefault(_removeBinding2);

	var _remove2 = __webpack_require__(12);

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
	        removeBinding: function removeBinding(binding) {
	          (0, _removeBinding3.default)(binding, {
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
	  }

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._setData = exports._handleError = exports._createNestedObject = exports._setUnmountHandler = exports._addListener = exports._updateSyncState = exports._firebaseRefsMixin = exports._addSync = exports._hasOwnNestedProperty = exports._getNestedObject = exports._isNestedPath = exports._isObject = exports._isValid = exports._toArray = exports._prepareData = exports._throwError = exports._setState = exports._returnRef = exports._addQueries = exports._createHash = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _removeBinding2 = __webpack_require__(3);

	var _removeBinding3 = _interopRequireDefault(_removeBinding2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	var _isValid = function _isValid(value) {
	  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? true : false;
	};

	var _isNestedPath = function _isNestedPath(path) {
	  return path.split('.').length > 1 ? true : false;
	};

	var _createNestedObject = function _createNestedObject(path, value) {
	  var obj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var keys = path.split('.');
	  var lastKey = value === undefined ? false : keys.pop();
	  var root = obj;

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var key = _step.value;

	      obj = obj[key] = obj[key] || {};
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  if (lastKey) obj[lastKey] = value;

	  return root;
	};

	var _getNestedObject = function _getNestedObject(obj, path) {
	  if (_isNestedPath(path) === false) return;

	  var keys = path.split('.');
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var key = _step2.value;

	      if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return;
	      obj = obj[key];
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  return obj;
	};

	var _hasOwnNestedProperty = function _hasOwnNestedProperty(obj, path) {
	  return _getNestedObject(obj, path) === undefined ? false : true;
	};

	var _prepareData = function _prepareData(snapshot) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var defaultValue = options.defaultValue,
	      asArray = options.asArray;

	  var data = snapshot.val();
	  if (data === null && _isValid(defaultValue)) return defaultValue;
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

	var _firebaseRefsMixin = function _firebaseRefsMixin(id, ref, refs) {
	  refs.set(id, ref);
	};

	var _handleError = function _handleError(onFailure, err) {
	  if (err && typeof onFailure === 'function') {
	    onFailure(err);
	  }
	};

	var _setUnmountHandler = function _setUnmountHandler(context, id, refs, listeners, syncs) {
	  var removeListeners = function removeListeners() {
	    (0, _removeBinding3.default)({ context: context, id: id }, { refs: refs, listeners: listeners, syncs: syncs });
	  };
	  if (typeof context.componentWillUnmount === 'function') {
	    var unmount = context.componentWillUnmount;
	  }
	  context.componentWillUnmount = function () {
	    removeListeners();
	    if (unmount) unmount.call(context);
	  };
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
	    } else {
	      var newState = _defineProperty({}, options.state, data);
	      if (_isNestedPath(options.state)) {
	        var root = options.state.split('.')[0];
	        // Merge the previous state with the new one
	        var prevState = _defineProperty({}, root, options.context.state[root]);
	        newState = _createNestedObject(options.state, data, prevState);
	      }
	      if (invoker === 'syncState') {
	        options.reactSetState.call(options.context, newState);
	        if (options.then && options.then.called === false) {
	          options.then.call(options.context);
	          options.then.called = true;
	        }
	      } else if (invoker === 'bindToState') {
	        _setState.call(options.context, newState);
	        if (options.then && options.then.called === false) {
	          options.then.call(options.context);
	          options.then.called = true;
	        }
	      }
	    }
	  }, options.onFailure));
	};

	exports._createHash = _createHash;
	exports._addQueries = _addQueries;
	exports._returnRef = _returnRef;
	exports._setState = _setState;
	exports._throwError = _throwError;
	exports._prepareData = _prepareData;
	exports._toArray = _toArray;
	exports._isValid = _isValid;
	exports._isObject = _isObject;
	exports._isNestedPath = _isNestedPath;
	exports._getNestedObject = _getNestedObject;
	exports._hasOwnNestedProperty = _hasOwnNestedProperty;
	exports._addSync = _addSync;
	exports._firebaseRefsMixin = _firebaseRefsMixin;
	exports._updateSyncState = _updateSyncState;
	exports._addListener = _addListener;
	exports._setUnmountHandler = _setUnmountHandler;
	exports._createNestedObject = _createNestedObject;
	exports._handleError = _handleError;
	exports._setData = _setData;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _removeBinding;

	var _utils = __webpack_require__(2);

	function _removeBinding(_ref, _ref2) {
	  var id = _ref.id,
	      context = _ref.context;
	  var refs = _ref2.refs,
	      listeners = _ref2.listeners,
	      syncs = _ref2.syncs;

	  var ref = refs.get(id);
	  var listener = listeners.get(id);
	  if (typeof ref !== 'undefined') {
	    ref.off('value', listener);
	    refs.delete(id);
	    listeners.delete(id);
	    if (syncs) {
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
	    }
	  }
	}

/***/ },
/* 4 */
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
	  defaultValue: function defaultValue(options) {
	    this.notObject(options);
	    if (options.hasOwnProperty('defaultValue')) {
	      if (!(0, _utils._isValid)(options.defaultValue)) {
	        (0, _utils._throwError)('The typeof defaultValue must be one of string, number, boolean, object.', 'INVALID_OPTIONS');
	      }
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
	    (0, _utils._throwError)(errorMsg, 'INVALID_ENDPOINT');
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
	    (0, _utils._throwError)(errorMsg, 'INVALID_CONFIG');
	  }
	};

	exports.optionValidators = optionValidators;
	exports._validateDatabase = _validateDatabase;
	exports._validateEndpoint = _validateEndpoint;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _push;

	var _validators = __webpack_require__(4);

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
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fetch;

	var _validators = __webpack_require__(4);

	var _utils = __webpack_require__(2);

	function _fetch(endpoint, options, db) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.defaultValue(options);
	  options.queries && _validators.optionValidators.query(options);
	  var ref = db.ref(endpoint);
	  ref = (0, _utils._addQueries)(ref, options.queries);
	  return ref.once('value').then(function (snapshot) {
	    var data = (0, _utils._prepareData)(snapshot, options);
	    if (options.then) {
	      options.then.call(options.context, data);
	    }
	    return data;
	  }).catch(function (err) {
	    //call onFailure callback if it exists otherwise rethrow error
	    if (options.onFailure && typeof options.onFailure === 'function') {
	      options.onFailure.call(options.context, err);
	    } else {
	      throw err;
	    }
	  });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _post;

	var _validators = __webpack_require__(4);

	function _post(endpoint, options, db) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.data(options);
	  var ref = db.ref(endpoint);
	  if (options.then) {
	    return ref.set(options.data, options.then);
	  } else {
	    return ref.set(options.data);
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _sync;

	var _validators = __webpack_require__(4);

	var _utils = __webpack_require__(2);

	function _sync(endpoint, options, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.state(options);
	  _validators.optionValidators.defaultValue(options);
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
	  (0, _utils._setUnmountHandler)(options.context, id, state.refs, state.listeners, state.syncs);
	  var sync = {
	    id: id,
	    updateFirebase: _utils._updateSyncState.bind(null, ref, options.onFailure, options.keepKeys),
	    stateKey: options.state
	  };
	  (0, _utils._addSync)(options.context, sync, state.syncs);

	  options.context.setState = function (data, cb) {
	    //if setState is a function, call it first before syncing to fb
	    if (typeof data === 'function') {
	      return _sync.reactSetState.call(options.context, data, function () {
	        if (cb) cb.call(options.context);
	        return options.context.setState.call(options.context, options.context.state);
	      });
	    }
	    //if callback is supplied, call setState first before syncing to fb
	    if (typeof cb === 'function') {
	      return _sync.reactSetState.call(options.context, data, function () {
	        cb();
	        return options.context.setState.call(options.context, data);
	      });
	    }
	    var syncsToCall = state.syncs.get(this);
	    //if sync does not exist, call original Component.setState
	    if (!syncsToCall || syncsToCall.length === 0) {
	      return _sync.reactSetState.call(this, data, cb);
	    }
	    var syncedKeys = syncsToCall.map(function (sync) {
	      return {
	        key: sync.stateKey,
	        update: sync.updateFirebase,
	        nested: (0, _utils._isNestedPath)(sync.stateKey)
	      };
	    });
	    syncedKeys.forEach(function (syncedKey) {
	      if (syncedKey.nested === true) {
	        if ((0, _utils._hasOwnNestedProperty)(data, syncedKey.key)) {
	          var datum = (0, _utils._getNestedObject)(data, syncedKey.key);
	          syncedKey.update(datum);
	        }
	      } else if (data.hasOwnProperty(syncedKey.key)) {
	        syncedKey.update(data[syncedKey.key]);
	      }
	    });
	    var allKeys = Object.keys(data);
	    allKeys.forEach(function (key) {
	      var absent = !syncedKeys.find(function (syncedKey) {
	        var k = syncedKey.key;
	        if (syncedKey.nested === true) {
	          // Check with the root
	          k = syncedKey.key.split('.')[0];
	        }
	        return k === key;
	      });

	      if (absent) {
	        var update = {};
	        update[key] = data[key];
	        _sync.reactSetState.call(options.context, update, cb);
	      }
	    });
	  };
	  return (0, _utils._returnRef)(endpoint, 'syncState', id, options.context);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _bind;

	var _validators = __webpack_require__(4);

	var _utils = __webpack_require__(2);

	function _bind(endpoint, options, invoker, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.defaultValue(options);
	  invoker === 'listenTo' && _validators.optionValidators.then(options);
	  invoker === 'bindToState' && _validators.optionValidators.state(options);
	  options.queries && _validators.optionValidators.query(options);
	  options.then && (options.then.called = false);

	  var id = (0, _utils._createHash)(endpoint, invoker);
	  var ref = state.db.ref(endpoint);
	  (0, _utils._firebaseRefsMixin)(id, ref, state.refs);
	  (0, _utils._addListener)(id, invoker, options, ref, state.listeners);
	  (0, _utils._setUnmountHandler)(options.context, id, state.refs, state.listeners, state.syncs);
	  return (0, _utils._returnRef)(endpoint, invoker, id, options.context);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _update;

	var _validators = __webpack_require__(4);

	function _update(endpoint, options, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.data(options);
	  var ref = state.db.ref(endpoint);
	  if (options.then) {
	    return ref.update(options.data, options.then);
	  } else {
	    return ref.update(options.data);
	  }
	}

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
	}

/***/ },
/* 12 */
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