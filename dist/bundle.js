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

	/*
	  listenTo: Listens to a Firebase endpoint and invokes a callback function when that endpoint changes.
	  bindToState: Listens to a Firebase endpoint and updates a specified property (if an array) or the whole state if an Object.
	  removeBinding: Removes bindings. Used in componentDidUnmount.
	  syncState: todo. Create a 2 way data binding between Firebase and your State.
	  fetch: Get data from endpoint without establishing socket connection.
	  post: Update firebase endpoint just once.
	*/

	'use strict';

	function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

	module.exports = (function () {
	  var Firebase = __webpack_require__(1);

	  var baseUrl = '';
	  var ref = null;
	  var rebase;
	  var firebaseRefs = {};
	  var firebaseListeners = {};

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

	  function _validateEndpoint(endpoint, onRemove) {
	    var defaultError = 'The Firebase endpoint you are trying to listen to';
	    var errorMsg;
	    if (typeof endpoint !== 'string') {
	      errorMsg = '' + defaultError + ' must be a string. Instead, got ' + endpoint;
	    } else if (endpoint.length === 0) {
	      errorMsg = '' + defaultError + ' must be a non-empty string. Instead, got ' + endpoint;
	    } else if (endpoint.length > 768) {
	      errorMsg = '' + defaultError + ' is too long to be stored in Firebase. It be less than 768 characters.';
	    } else if (onRemove && firebaseRefs[endpoint]) {
	      errorMsg = '' + defaultError + ' (' + endpoint + ') has already been bound. An endpoint may only have one binding';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, 'INVALID_ENDPOINT');
	    }
	  };

	  function _validateOptions(options, invoker) {
	    var errorMsg;
	    if (!_isObject(options)) {
	      errorMsg = 'options argument must be an Object. Instead, got ' + options + '.';
	    } else if (invoker !== 'fetch' && (!options.context || !_isObject(options.context))) {
	      errorMsg = 'options argument must contain a context property which is an Object. Instead, got ' + options.context + '.';
	    } else if (invoker === 'bindToState' && options.asArray === true && !options.state) {
	      errorMsg = 'Because your component\'s state must be an object, if you use asArray you must also specify a state property to which the new array will be a value of.';
	    } else if (options.then && typeof options.then !== 'function') {
	      errorMsg = 'options.then must be a function. Instead, got ' + options.then + '.';
	    } else if (options.then && options.state) {
	      errorMsg = 'Since options.then is a callback function which gets invoked with the data from Firebase, you shouldn\'t have options.then and also specify the state with options.state.';
	    } else if (invoker === 'fetch' && !options.then) {
	      errorMsg = 'fetch requires a options.then property in order to invoke with the data from firebase';
	    }

	    if (typeof errorMsg !== 'undefined') {
	      _throwError(errorMsg, 'INVALID_OPTIONS');
	    }
	  };

	  function _fetch(endpoint, options) {
	    _validateEndpoint(endpoint);
	    _validateOptions(options, 'fetch');
	    ref.child(endpoint).once('value', function (snapshot) {
	      options.then(snapshot.val());
	    }, options.onConnectionLoss);
	  };

	  function _setState(newState) {
	    this.setState(newState);
	  };

	  function _post(endpoint, options) {
	    //WIP
	    _validateEndpoint(endpoint);
	    // _validateOptions(options);
	    if (options.then) {
	      ref.child(endpoint).set(options.data, options.then);
	    } else {
	      ref.child(endpoint).set(options.data);
	    }
	  }

	  function _bind(endpoint, options, invoker) {
	    _validateEndpoint(endpoint);
	    _validateOptions(options, invoker);
	    firebaseRefs[endpoint] = ref.ref();
	    firebaseListeners[endpoint] = ref.child(endpoint).on('value', function (snapshot) {
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
	    }, options.onConnectionLoss);
	  };

	  function _sync(endpoint, options) {
	    _validateEndpoint(endpoint);
	    _validateOptions(options);

	    var context = options.context;
	    var reactSetState = context.setState;

	    firebaseRefs[endpoint] = ref.ref();
	    firebaseListeners[endpoint] = ref.child(endpoint).on('value', function (snapshot) {
	      var data = snapshot.val();
	      if (data === null) {
	        reactSetState.call(context, _defineProperty({}, options.state, options.asArray === true ? [] : {}));
	      } else {
	        data = options.asArray === true ? _toArray(data) : data;
	        reactSetState.call(context, _defineProperty({}, options.state, data));
	      }
	    });

	    context.setState = function (data) {
	      for (var key in data) {
	        if (key === options.state) {
	          _updateSyncState(ref.child(endpoint), data[key], key);
	        } else {
	          reactSetState.call(options.context, data);
	        }
	      }
	    };

	    function _updateSyncState(ref, data, key) {
	      if (_isObject(data)) {
	        for (var prop in data) {
	          _updateSyncState(ref.child(prop), data[prop], prop);
	        }
	      } else {
	        ref.set(data);
	      }
	    };
	  };

	  function _removeBinding(endpoint) {
	    _validateEndpoint(endpoint);

	    if (typeof firebaseRefs[endpoint] === 'undefined') {
	      var errorMsg = 'Unexpected value for endpoint. ' + endpoint + ' was either never bound or has already been unbound.';
	      _throwError(errorMsg, 'UNBOUND_ENDPOINT_VARIABLE');
	    }

	    firebaseRefs[endpoint].off('value', firebaseListeners[endpoint]);
	    delete firebaseRefs[endpoint];
	    delete firebaseListeners[endpoint];
	  };

	  function init() {
	    return {
	      listenTo: function listenTo(endpoint, options) {
	        _bind(endpoint, options, 'listenTo');
	      },
	      bindToState: function bindToState(endpoint, options) {
	        _bind(endpoint, options, 'bindToState');
	      },
	      syncState: function syncState(endpoint, options) {
	        _sync(endpoint, options);
	      },
	      fetch: function fetch(endpoint, options) {
	        _fetch(endpoint, options);
	      },
	      post: function post(endpoint, options) {
	        _post(endpoint, options);
	      },
	      removeBinding: function removeBinding(endpoint) {
	        _removeBinding(endpoint, true);
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