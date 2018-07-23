(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("firebase/app"));
	else if(typeof define === 'function' && define.amd)
		define(["firebase/app"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("firebase/app")) : factory(root["firebase/app"]);
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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _utils = __webpack_require__(2);

	var _validators = __webpack_require__(5);

	var _app = __webpack_require__(6);

	var _app2 = _interopRequireDefault(_app);

	var _push2 = __webpack_require__(7);

	var _push3 = _interopRequireDefault(_push2);

	var _fetch2 = __webpack_require__(8);

	var _fetch3 = _interopRequireDefault(_fetch2);

	var _post2 = __webpack_require__(9);

	var _post3 = _interopRequireDefault(_post2);

	var _sync2 = __webpack_require__(10);

	var _sync3 = _interopRequireDefault(_sync2);

	var _bind2 = __webpack_require__(11);

	var _bind3 = _interopRequireDefault(_bind2);

	var _update2 = __webpack_require__(12);

	var _update3 = _interopRequireDefault(_update2);

	var _reset2 = __webpack_require__(13);

	var _reset3 = _interopRequireDefault(_reset2);

	var _removeBinding2 = __webpack_require__(3);

	var _removeBinding3 = _interopRequireDefault(_removeBinding2);

	var _remove2 = __webpack_require__(14);

	var _remove3 = _interopRequireDefault(_remove2);

	var _fsSync2 = __webpack_require__(15);

	var _fsSync3 = _interopRequireDefault(_fsSync2);

	var _fsRemoveBinding2 = __webpack_require__(4);

	var _fsRemoveBinding3 = _interopRequireDefault(_fsRemoveBinding2);

	var _fsBind2 = __webpack_require__(16);

	var _fsBind3 = _interopRequireDefault(_fsBind2);

	var _fsGet2 = __webpack_require__(17);

	var _fsGet3 = _interopRequireDefault(_fsGet2);

	var _fsRemoveDoc2 = __webpack_require__(18);

	var _fsRemoveDoc3 = _interopRequireDefault(_fsRemoveDoc2);

	var _fsAddToCollection2 = __webpack_require__(19);

	var _fsAddToCollection3 = _interopRequireDefault(_fsAddToCollection2);

	var _fsRemoveFromCollection2 = __webpack_require__(20);

	var _fsRemoveFromCollection3 = _interopRequireDefault(_fsRemoveFromCollection2);

	var _fsUpdateDoc2 = __webpack_require__(21);

	var _fsUpdateDoc3 = _interopRequireDefault(_fsUpdateDoc2);

	var _fsReset2 = __webpack_require__(22);

	var _fsReset3 = _interopRequireDefault(_fsReset2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//database
	module.exports = function () {
	  function init(db) {
	    return function () {
	      var refs = new Map();
	      var listeners = new Map();
	      var syncs = new WeakMap();

	      if (typeof db.ref === 'function') {
	        var rebase = {
	          initializedApp: db.app,
	          timestamp: _app2.default.database.ServerValue.TIMESTAMP,
	          listenTo: function listenTo(endpoint, options) {
	            return _bind3.default.call(this, endpoint, options, 'listenTo', {
	              db: db,
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          },
	          bindToState: function bindToState(endpoint, options) {
	            return _bind3.default.call(this, endpoint, options, 'bindToState', {
	              db: db,
	              refs: refs,
	              listeners: listeners
	            });
	          },
	          syncState: function syncState(endpoint, options) {
	            return _sync3.default.call(this, endpoint, options, {
	              db: db,
	              refs: refs,
	              listeners: listeners,
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
	            return (0, _update3.default)(endpoint, options, { db: db });
	          },
	          push: function push(endpoint, options) {
	            return (0, _push3.default)(endpoint, options, db);
	          },
	          removeBinding: function removeBinding(binding) {
	            (0, _removeBinding3.default)(binding, {
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          },
	          remove: function remove(endpoint, fn) {
	            return (0, _remove3.default)(endpoint, db, fn);
	          },
	          reset: function reset() {
	            return (0, _reset3.default)({
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          }
	        };
	      } else {
	        var rebase = {
	          initializedApp: db.app,
	          timestamp: _app2.default.firestore.FieldValue.serverTimestamp(),
	          bindDoc: function bindDoc(path, options) {
	            return _fsBind3.default.call(this, path, options, 'bindDoc', {
	              db: db,
	              refs: refs,
	              listeners: listeners
	            });
	          },
	          bindCollection: function bindCollection(path, options) {
	            return _fsBind3.default.call(this, path, options, 'bindCollection', {
	              db: db,
	              refs: refs,
	              listeners: listeners
	            });
	          },
	          syncDoc: function syncDoc(doc, options) {
	            return _fsSync3.default.call(this, doc, options, {
	              db: db,
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          },
	          listenToDoc: function listenToDoc(doc, options) {
	            return _fsBind3.default.call(this, doc, options, 'listenToDoc', {
	              db: db,
	              refs: refs,
	              listeners: listeners
	            });
	          },
	          listenToCollection: function listenToCollection(path, options) {
	            return _fsBind3.default.call(this, path, options, 'listenToCollection', {
	              db: db,
	              refs: refs,
	              listeners: listeners
	            });
	          },
	          addToCollection: function addToCollection(path, doc, key) {
	            return _fsAddToCollection3.default.call(this, path, doc, db, key);
	          },
	          updateDoc: function updateDoc(path, doc, options) {
	            return _fsUpdateDoc3.default.call(this, path, doc, db);
	          },
	          get: function get(path, options) {
	            return _fsGet3.default.call(this, path, options, db);
	          },
	          removeDoc: function removeDoc(path) {
	            return (0, _fsRemoveDoc3.default)(path, db);
	          },
	          removeFromCollection: function removeFromCollection(path, options) {
	            return (0, _fsRemoveFromCollection3.default)(path, db, options);
	          },
	          removeBinding: function removeBinding(binding) {
	            (0, _fsRemoveBinding3.default)(binding, {
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          },
	          reset: function reset() {
	            return (0, _fsReset3.default)({
	              refs: refs,
	              listeners: listeners,
	              syncs: syncs
	            });
	          }
	        };
	      }
	      return rebase;
	    }();
	  }

	  return {
	    createClass: function createClass(db) {
	      (0, _validators._validateDatabase)(db);
	      return init(db);
	    }
	  };
	}();

	//firestore
	//helpers

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._fsCreateRef = exports._fsSetUnmountHandler = exports._setData = exports._handleError = exports._createNestedObject = exports._setUnmountHandler = exports._addFirestoreListener = exports._addListener = exports._fsUpdateSyncState = exports._updateSyncState = exports._firebaseRefsMixin = exports._addSync = exports._hasOwnNestedProperty = exports._getSegmentCount = exports._getNestedObject = exports._isNestedPath = exports._isObject = exports._isValid = exports._toArray = exports._fsPrepareData = exports._prepareData = exports._throwError = exports._setState = exports._returnRef = exports._addFirestoreQuery = exports._addQueries = exports._createHash = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _removeBinding2 = __webpack_require__(3);

	var _removeBinding3 = _interopRequireDefault(_removeBinding2);

	var _fsRemoveBinding2 = __webpack_require__(4);

	var _fsRemoveBinding3 = _interopRequireDefault(_fsRemoveBinding2);

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
	    /* istanbul ignore else */
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

	var _addFirestoreQuery = function _addFirestoreQuery(ref, query) {
	  if (query) {
	    return query(ref);
	  }
	  return ref;
	};

	var _createHash = function _createHash(endpoint, invoker) {
	  var hash = 0;
	  var str = endpoint + invoker + Math.random();
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

	var _fsSetUnmountHandler = function _fsSetUnmountHandler(context, id, refs, listeners, syncs) {
	  var removeListeners = function removeListeners() {
	    (0, _fsRemoveBinding3.default)({ context: context, id: id }, { refs: refs, listeners: listeners, syncs: syncs });
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

	var _fsUpdateSyncState = function _fsUpdateSyncState(ref, data) {
	  ref.set(data);
	};

	var _addListener = function _addListener(id, invoker, options, ref, listeners) {
	  ref = _addQueries(ref, options.queries);
	  var boundOnFailure = typeof options.onFailure === 'function' ? options.onFailure.bind(options.context) : null;
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
	  }, boundOnFailure));
	};

	var _addFirestoreListener = function _addFirestoreListener(id, invoker, options, ref, listeners) {
	  ref = _addFirestoreQuery(ref, options.query);
	  var boundOnFailure = typeof options.onFailure === 'function' ? options.onFailure.bind(options.context) : undefined;
	  listeners.set(id, ref.onSnapshot(function (snapshot) {
	    if (invoker.match(/^listenTo/)) {
	      if (invoker === 'listenToDoc') {
	        var newState = _fsPrepareData(snapshot, options);
	        return options.then.call(options.context, newState);
	      }
	      if (invoker === 'listenToCollection') {
	        var _newState2 = _fsPrepareData(snapshot, options, true);
	        return options.then.call(options.context, _newState2);
	      }
	    } else {
	      if (invoker === 'syncDoc') {
	        var _newState3 = _fsPrepareData(snapshot, options);
	        options.reactSetState.call(options.context, function (currentState) {
	          return Object.assign(currentState, _newState3);
	        });
	      } else if (invoker === 'bindDoc') {
	        var _newState4 = _fsPrepareData(snapshot, options);
	        _setState.call(options.context, function (currentState) {
	          return Object.assign(currentState, _newState4);
	        });
	      } else if (invoker === 'bindCollection') {
	        var _newState5 = _fsPrepareData(snapshot, options, true);
	        _setState.call(options.context, function (currentState) {
	          return Object.assign(currentState, _newState5);
	        });
	      }
	      if (options.then && options.then.called === false) {
	        options.then.call(options.context);
	        options.then.called = true;
	      }
	    }
	  }, boundOnFailure));
	};

	var _getSegmentCount = function _getSegmentCount(path) {
	  return path.match(/^\//) ? path.split('/').slice(1).length : path.split('/').length;
	};

	var _fsPrepareData = function _fsPrepareData(snapshot, options) {
	  var isCollection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var meta = {};
	  if (!isCollection) {
	    var data = {};
	    if (snapshot.exists) {
	      if (options.withRefs) meta.ref = snapshot.ref;
	      if (options.withIds) meta.id = snapshot.id;
	      data = snapshot.data();
	    } else {
	      data = {};
	    }
	    return options.state ? _defineProperty({}, options.state, Object.assign({}, data, meta)) : Object.assign({}, data, meta);
	  }
	  var collection = [];
	  if (!snapshot.empty) {
	    snapshot.forEach(function (doc) {
	      if (options.withRefs) meta.ref = doc.ref;
	      if (options.withIds) meta.id = doc.id;
	      collection.push(Object.assign({}, doc.data(), meta));
	    });
	  }
	  return options.state ? _defineProperty({}, options.state, collection) : collection;
	};

	var _fsCreateRef = function _fsCreateRef(pathOrRef, db) {
	  if ((typeof pathOrRef === 'undefined' ? 'undefined' : _typeof(pathOrRef)) === 'object') {
	    return pathOrRef;
	  }
	  var segmentCount = _getSegmentCount(pathOrRef);
	  var ref;
	  if (segmentCount % 2 === 0) {
	    ref = db.doc(pathOrRef);
	  } else {
	    ref = db.collection(pathOrRef);
	  }
	  return ref;
	};

	exports._createHash = _createHash;
	exports._addQueries = _addQueries;
	exports._addFirestoreQuery = _addFirestoreQuery;
	exports._returnRef = _returnRef;
	exports._setState = _setState;
	exports._throwError = _throwError;
	exports._prepareData = _prepareData;
	exports._fsPrepareData = _fsPrepareData;
	exports._toArray = _toArray;
	exports._isValid = _isValid;
	exports._isObject = _isObject;
	exports._isNestedPath = _isNestedPath;
	exports._getNestedObject = _getNestedObject;
	exports._getSegmentCount = _getSegmentCount;
	exports._hasOwnNestedProperty = _hasOwnNestedProperty;
	exports._addSync = _addSync;
	exports._firebaseRefsMixin = _firebaseRefsMixin;
	exports._updateSyncState = _updateSyncState;
	exports._fsUpdateSyncState = _fsUpdateSyncState;
	exports._addListener = _addListener;
	exports._addFirestoreListener = _addFirestoreListener;
	exports._setUnmountHandler = _setUnmountHandler;
	exports._createNestedObject = _createNestedObject;
	exports._handleError = _handleError;
	exports._setData = _setData;
	exports._fsSetUnmountHandler = _fsSetUnmountHandler;
	exports._fsCreateRef = _fsCreateRef;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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
	        /*istanbul ignore else */
	        if (idx !== -1) {
	          currentSyncs.splice(idx, 1);
	          syncs.set(context, currentSyncs);
	        }
	      }
	    }
	  }
	}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsRemoveBinding;
	function _fsRemoveBinding(_ref, _ref2) {
	  var id = _ref.id,
	      context = _ref.context;
	  var refs = _ref2.refs,
	      listeners = _ref2.listeners,
	      syncs = _ref2.syncs;

	  var unsubscribe = listeners.get(id);
	  if (typeof unsubscribe === 'function') {
	    unsubscribe();
	    refs.delete(id);
	    listeners.delete(id);
	    if (syncs) {
	      var currentSyncs = syncs.get(context);
	      if (currentSyncs && currentSyncs.length > 0) {
	        var idx = currentSyncs.findIndex(function (item, index) {
	          return item.id === id;
	        });
	        /*istanbul ignore else */
	        if (idx !== -1) {
	          currentSyncs.splice(idx, 1);
	          syncs.set(context, currentSyncs);
	        }
	      }
	    }
	  }
	}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports._validateCollectionPath = exports._validateDocumentPath = exports._validateEndpoint = exports._validateDatabase = exports.optionValidators = undefined;

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
	  if ((typeof endpoint === 'undefined' ? 'undefined' : _typeof(endpoint)) === 'object') {
	    if (endpoint.hasOwnProperty('firestore')) {
	      return;
	    }
	  }
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
	  if ((typeof db === 'undefined' ? 'undefined' : _typeof(db)) !== 'object' || !db.ref && !db.collection) {
	    errorMsg = defaultError + ' Expected an initialized firebase or firestore database object.';
	  }
	  if (typeof errorMsg !== 'undefined') {
	    (0, _utils._throwError)(errorMsg, 'INVALID_CONFIG');
	  }
	};

	var _validateDocumentPath = function _validateDocumentPath(path) {
	  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.hasOwnProperty('firestore')) return;
	  var defaultError = 'Invalid document path or reference.';
	  if (typeof path !== 'string') (0, _utils._throwError)(defaultError, 'INVALID_ENDPOINT');
	  var segmentCount = (0, _utils._getSegmentCount)(path);
	  if (segmentCount % 2 !== 0) (0, _utils._throwError)(defaultError, 'INVALID_ENDPOINT');
	};

	var _validateCollectionPath = function _validateCollectionPath(path) {
	  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.hasOwnProperty('firestore')) return;
	  var defaultError = 'Invalid collection path or reference.';
	  if (typeof path !== 'string') (0, _utils._throwError)(defaultError, 'INVALID_ENDPOINT');
	  var segmentCount = (0, _utils._getSegmentCount)(path);
	  if (segmentCount % 2 === 0) (0, _utils._throwError)(defaultError, 'INVALID_ENDPOINT');
	};

	exports.optionValidators = optionValidators;
	exports._validateDatabase = _validateDatabase;
	exports._validateEndpoint = _validateEndpoint;
	exports._validateDocumentPath = _validateDocumentPath;
	exports._validateCollectionPath = _validateCollectionPath;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _push;

	var _validators = __webpack_require__(5);

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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fetch;

	var _validators = __webpack_require__(5);

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _post;

	var _validators = __webpack_require__(5);

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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _sync;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _sync(endpoint, options, state) {
	  (0, _validators._validateEndpoint)(endpoint);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.state(options);
	  _validators.optionValidators.defaultValue(options);
	  options.queries && _validators.optionValidators.query(options);
	  options.then && (options.then.called = false);
	  options.onFailure = options.onFailure ? options.onFailure.bind(options.context) : null;
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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _bind;

	var _validators = __webpack_require__(5);

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

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _update;

	var _validators = __webpack_require__(5);

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

/***/ }),
/* 13 */
/***/ (function(module, exports) {

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

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (endpoint, db, fn) {
	  return db.ref().child(endpoint).remove(fn);
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsSync;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _fsSync(document, options, state) {
	  //validate arguments
	  (0, _validators._validateDocumentPath)(document);
	  _validators.optionValidators.context(options);
	  _validators.optionValidators.state(options);
	  options.then && (options.then.called = false);
	  //store reference to react's setState
	  if (_fsSync.called !== true) {
	    _fsSync.reactSetState = options.context.setState;
	    _fsSync.called = true;
	  }
	  options.reactSetState = _fsSync.reactSetState;

	  var id = (0, _utils._createHash)(document, 'syncDoc');
	  var ref = (0, _utils._fsCreateRef)(document, state.db);
	  (0, _utils._firebaseRefsMixin)(id, ref, state.refs);
	  (0, _utils._addFirestoreListener)(id, 'syncDoc', options, ref, state.listeners);
	  (0, _utils._fsSetUnmountHandler)(options.context, id, state.refs, state.listeners, state.syncs);
	  var sync = {
	    id: id,
	    updateFirebase: _utils._fsUpdateSyncState.bind(null, ref),
	    stateKey: options.state
	  };
	  (0, _utils._addSync)(options.context, sync, state.syncs);
	  options.context.setState = function (data, cb) {
	    //if setState is a function, call it first before syncing to fb
	    if (typeof data === 'function') {
	      return _fsSync.reactSetState.call(options.context, data, function () {
	        if (cb) cb.call(options.context);
	        return options.context.setState.call(options.context, options.context.state);
	      });
	    }
	    //if callback is supplied, call setState first before syncing to fb
	    if (typeof cb === 'function') {
	      return _fsSync.reactSetState.call(options.context, data, function () {
	        cb();
	        return options.context.setState.call(options.context, data);
	      });
	    }
	    var syncsToCall = state.syncs.get(this);
	    //if sync does not exist, call original Component.setState
	    if (!syncsToCall || syncsToCall.length === 0) {
	      return _fsSync.reactSetState.call(this, data, cb);
	    }
	    //send the update of synced keys to firestore
	    var syncedKeys = syncsToCall.map(function (sync) {
	      return {
	        key: sync.stateKey,
	        update: sync.updateFirebase
	      };
	    });
	    syncedKeys.forEach(function (syncedKey) {
	      if (data[syncedKey.key]) {
	        syncedKey.update(data[syncedKey.key]);
	      }
	    });
	    //send the update of all other keys through setState
	    var allKeys = Object.keys(data);
	    allKeys.forEach(function (key) {
	      var absent = !syncedKeys.find(function (syncedKey) {
	        return syncedKey.key === key;
	      });
	      if (absent) {
	        var update = {};
	        update[key] = data[key];
	        _fsSync.reactSetState.call(options.context, function (currentState) {
	          return Object.assign(currentState, update);
	        }, cb);
	      }
	    });
	  };
	  return (0, _utils._returnRef)(document, 'syncDoc', id, options.context);
	}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsBind;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _fsBind(path, options, invoker, state) {
	  _validators.optionValidators.context(options);
	  options.then && (options.then.called = false);
	  if (invoker === 'bindDoc') {
	    (0, _validators._validateDocumentPath)(path);
	  }
	  if (invoker === 'bindCollection') {
	    _validators.optionValidators.state(options);
	    (0, _validators._validateCollectionPath)(path);
	  }
	  if (invoker === 'listenToDoc') {
	    (0, _validators._validateDocumentPath)(path);
	    _validators.optionValidators.then(options);
	  }
	  if (invoker === 'listenToCollection') {
	    (0, _validators._validateCollectionPath)(path);
	    _validators.optionValidators.then(options);
	  }
	  var ref = (0, _utils._fsCreateRef)(path, state.db);
	  var id = (0, _utils._createHash)(path, invoker);
	  (0, _utils._firebaseRefsMixin)(id, ref, state.refs);
	  (0, _utils._addFirestoreListener)(id, invoker, options, ref, state.listeners);
	  (0, _utils._fsSetUnmountHandler)(options.context, id, state.refs, state.listeners, state.syncs);
	  return (0, _utils._returnRef)(path, invoker, id, options.context);
	}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsGet;

	var _utils = __webpack_require__(2);

	var _validators = __webpack_require__(5);

	function _fsGet(endpoint) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var db = arguments[2];

	  (0, _validators._validateEndpoint)(endpoint);
	  var ref = (0, _utils._fsCreateRef)(endpoint, db);
	  //check if ref is a collection
	  var isCollection = !!ref.add;
	  ref = (0, _utils._addFirestoreQuery)(ref, options.query);
	  return ref.get().then(function (snapshot) {
	    if (isCollection && !snapshot.empty || !isCollection && snapshot.exists) {
	      return (0, _utils._fsPrepareData)(snapshot, options, isCollection);
	    } else {
	      return Promise.reject(new Error('No Result'));
	    }
	  });
	}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsRemoveDoc;

	var _utils = __webpack_require__(2);

	function _fsRemoveDoc(path, db) {
	  var ref = (0, _utils._fsCreateRef)(path, db);
	  return ref.delete();
	}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsAddToCollection;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _fsAddToCollection(path, doc, db, key) {
	  (0, _validators._validateCollectionPath)(path);
	  var ref = (0, _utils._fsCreateRef)(path, db);
	  if (key) {
	    return ref.doc(key).set(doc);
	  }
	  return ref.add(doc);
	}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsRemoveFromCollection;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _fsRemoveFromCollection(path, db) {
	  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  (0, _validators._validateCollectionPath)(path);
	  var ref = (0, _utils._fsCreateRef)(path, db);
	  ref = (0, _utils._addFirestoreQuery)(ref, options.query);
	  return ref.get().then(function (snapshot) {
	    if (!snapshot.empty) {
	      var batch = db.batch();
	      snapshot.forEach(function (doc) {
	        batch.delete(doc.ref);
	      });
	      return batch.commit();
	    }
	  });
	}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsUpdateDoc;

	var _validators = __webpack_require__(5);

	var _utils = __webpack_require__(2);

	function _fsUpdateDoc(document, data, db) {
	  (0, _validators._validateDocumentPath)(document);
	  var ref = (0, _utils._fsCreateRef)(document, db);
	  return ref.update(data);
	}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = _fsReset;
	function _fsReset(state) {
	  state.listeners.forEach(function (unsubscribe, id) {
	    unsubscribe();
	  });
	  state.listeners = new Map();
	  state.refs = new Map();
	  state.syncs = new WeakMap();
	  return null;
	}

/***/ })
/******/ ])
});
;