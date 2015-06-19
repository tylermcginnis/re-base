(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("firebase"));
	else if(typeof define === 'function' && define.amd)
		define(["firebase"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("firebase")) : factory(root["Firebase"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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

	'use strict';

	function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

	module.exports = (function () {
	  var Firebase = __webpack_require__(1);

	  var baseUrl = '';
	  var ref = null;
	  var rebase;
	  var firebaseRefs = {};
	  var firebaseListeners = {};

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
	    makeError: function makeError(prop, type, actual) {
	      _throwError('The options argument must contain a ' + prop + ' property of type ' + type + '. Instead, got ' + actual, 'INVALID_OPTIONS');
	    }
	  };

	  function _toArray(obj) {
	    var arr = [];
	    for (var key in obj) {
	      if (_isObject(obj[key])) {
	        obj[key].key = key;
	      }
	      arr.push(obj[key]);
	    }
	    return arr;
	  }

	  function _isObject(obj) {
	    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
	  }

	  function _throwError(msg, code) {
	    var err = new Error('REBASE: ' + msg);
	    err.code = code;
	    throw err;
	  }

	  function _validateBaseURL(url) {
	    var defaultError = 'Rebase.createClass failed.';
	    var errorMsg;
	    if (typeof url !== 'string') {
	      errorMsg = '' + defaultError + ' URL must be a string.';
	    } else if (!url || arguments.length > 1) {
	      errorMsg = '' + defaultError + ' Was called with more or less than 1 argument. Expects 1.';
	    } else if (url.length === '') {
	      errorMsg = '' + defaultError + ' URL cannot be an empty string.';
	    } else if (url.indexOf('.firebaseio.com') === -1) {
	      errorMsg = '' + defaultError + ' URL must be in the format of https://<YOUR FIREBASE>.firebaseio.com. Instead, got ' + url + '.';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, 'INVALID_URL');
	    }
	  };

	  function _validateEndpoint(endpoint) {
	    var defaultError = 'The Firebase endpoint you are trying to listen to';
	    var errorMsg;
	    if (typeof endpoint !== 'string') {
	      errorMsg = '' + defaultError + ' must be a string. Instead, got ' + endpoint;
	    } else if (endpoint.length === 0) {
	      errorMsg = '' + defaultError + ' must be a non-empty string. Instead, got ' + endpoint;
	    } else if (endpoint.length > 768) {
	      errorMsg = '' + defaultError + ' is too long to be stored in Firebase. It be less than 768 characters.';
	    } else if (/^$|[\[\]\.\#\$]/.test(endpoint)) {
	      errorMsg = '' + defaultError + ' in invalid. Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]".';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, 'INVALID_ENDPOINT');
	    }
	  };

	  function _setState(newState) {
	    this.setState(newState);
	  };

	  function _returnRef(endpoint, method) {
	    return { endpoint: endpoint, method: method };
	  }

	  function _fetch(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.context(options);
	    optionValidators.then(options);
	    ref.child(endpoint).once('value', function (snapshot) {
	      if (options.asArray === true) {
	        options.then.call(options.context, _toArray(snapshot.val()));
	      } else {
	        options.then.call(options.context, snapshot.val());
	      }
	    });
	  };

	  function _addListener(endpoint, invoker, ref, options) {
	    firebaseListeners[endpoint][invoker] = ref.child(endpoint).on('value', function (snapshot) {
	      var data = snapshot.val() || (options.asArray === true ? [] : {});
	      if (options.then) {
	        options.asArray === true ? options.then.call(options.context, _toArray(data)) : options.then.call(options.context, data);
	      } else {
	        if (options.state) {
	          var newState = {};
	          options.asArray === true ? newState[options.state] = _toArray(data) : newState[options.state] = data;
	          _setState.call(options.context, newState);
	        } else {
	          _setState.call(options.context, data);
	        }
	      }
	    });
	  }

	  function _endpointMixin(endpoint, invoker, ref) {
	    var flag = false;
	    if (!_isObject(firebaseRefs[endpoint])) {
	      firebaseRefs[endpoint] = _defineProperty({}, invoker, ref.ref());
	      firebaseListeners[endpoint] = {};
	      flag = true;
	    } else if (!firebaseRefs[endpoint][invoker]) {
	      firebaseRefs[endpoint][invoker] = ref.ref();
	      flag = true;
	    } else {
	      _throwError('Endpoint (' + endpoint + ') already has listener ' + invoker, 'INVALID_ENDPOINT');
	    }
	    return flag;
	  };

	  function _bind(endpoint, options, invoker) {
	    _validateEndpoint(endpoint);
	    //REFACTOR
	    if (invoker === 'listenTo') {
	      optionValidators.context(options);
	      optionValidators.then(options);
	    } else if (invoker === 'bindToState') {
	      optionValidators.context(options);
	      optionValidators.state(options);
	    }
	    var flag = _endpointMixin(endpoint, invoker, ref);
	    flag && _addListener(endpoint, invoker, ref, options);
	    return _returnRef(endpoint, invoker);
	  };

	  function _sync(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.context(options);
	    optionValidators.state(options);
	    var context = options.context;
	    var reactSetState = context.setState;
	    var flag = _endpointMixin(endpoint, 'syncState', ref);
	    if (flag === true) {
	      firebaseListeners[endpoint].syncState = ref.child(endpoint).on('value', function (snapshot) {
	        var data = snapshot.val();
	        if (data === null) {
	          reactSetState.call(context, _defineProperty({}, options.state, options.asArray === true ? [] : {}));
	        } else {
	          data = options.asArray === true ? _toArray(data) : data;
	          reactSetState.call(context, _defineProperty({}, options.state, data));
	        }
	      });
	    }

	    function _updateSyncState(ref, data, key) {
	      if (_isObject(data)) {
	        for (var prop in data) {
	          _updateSyncState(ref.child(prop), data[prop], prop);
	        }
	      } else {
	        ref.set(data);
	      }
	    };

	    context.setState = function (data) {
	      for (var key in data) {
	        if (key === options.state) {
	          _updateSyncState(ref.child(endpoint), data[key], key);
	        } else {
	          reactSetState.call(options.context, data);
	        }
	      }
	    };
	    return _returnRef(endpoint, 'syncState');
	  };

	  function _post(endpoint, options) {
	    _validateEndpoint(endpoint);
	    optionValidators.then(options);
	    optionValidators.data(options);
	    if (options.then) {
	      ref.child(endpoint).set(options.data, options.then);
	    } else {
	      ref.child(endpoint).set(options.data);
	    }
	  }

	  function _removeBinding(refObj) {
	    _validateEndpoint(refObj.endpoint);
	    if (typeof firebaseRefs[refObj.endpoint][refObj.method] === 'undefined') {
	      var errorMsg = 'Unexpected value for endpoint. ' + refObj.endpoint + ' was either never bound or has already been unbound.';
	      _throwError(errorMsg, 'UNBOUND_ENDPOINT_VARIABLE');
	    }
	    firebaseRefs[refObj.endpoint][refObj.method].off('value', firebaseListeners[refObj.endpoint][refObj.method]);
	    delete firebaseRefs[refObj.endpoint][refObj.method];
	    delete firebaseListeners[refObj.endpoint][refObj.method];
	  };

	  function _reset() {
	    baseUrl = '';
	    ref = undefined;
	    rebase = undefined;
	    for (var key in firebaseRefs) {
	      for (var prop in firebaseRefs[key]) {
	        firebaseRefs[key][prop].off('value', firebaseListeners[key][prop]);
	        delete firebaseRefs[key][prop];
	        delete firebaseListeners[key][prop];
	      }
	    }
	    firebaseRefs = {};
	    firebaseListeners = {};
	  }

	  function init() {
	    return {
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
	      removeBinding: function removeBinding(endpoint) {
	        _removeBinding(endpoint, true);
	      },
	      reset: function reset() {
	        _reset();
	      }
	    };
	  }

	  return {
	    createClass: function createClass(url) {
	      if (rebase) {
	        return rebase;
	      }

	      _validateBaseURL(url);
	      baseUrl = url;
	      ref = new Firebase(baseUrl);
	      rebase = init();

	      return rebase;
	    }
	  };
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;