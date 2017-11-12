import _removeBinding from './removeBinding';
import _fsRemoveBinding from './fsRemoveBinding';

const _isObject = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
    ? true
    : false;
};

const _toArray = function(snapshot) {
  var arr = [];
  snapshot.forEach(function(childSnapshot) {
    var val = childSnapshot.val();
    if (_isObject(val)) {
      val.key = childSnapshot.key;
    }
    arr.push(val);
  });
  return arr;
};

const _isValid = function(value) {
  return typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'object'
    ? true
    : false;
};

const _isNestedPath = function(path) {
  return path.split('.').length > 1 ? true : false;
};

const _createNestedObject = function(path, value, obj = {}) {
  let keys = path.split('.');
  const lastKey = value === undefined ? false : keys.pop();
  const root = obj;

  for (let key of keys) {
    obj = obj[key] = obj[key] || {};
  }
  if (lastKey) obj[lastKey] = value;

  return root;
};

const _getNestedObject = function(obj, path) {
  if (_isNestedPath(path) === false) return;

  const keys = path.split('.');
  for (let key of keys) {
    if (!obj || typeof obj !== 'object') return;
    obj = obj[key];
  }

  return obj;
};

const _hasOwnNestedProperty = function(obj, path) {
  return _getNestedObject(obj, path) === undefined ? false : true;
};

const _prepareData = function(snapshot, options = {}) {
  const { defaultValue, asArray } = options;
  const data = snapshot.val();
  if (data === null && _isValid(defaultValue)) return defaultValue;
  if (asArray === true) return _toArray(snapshot);
  return data === null ? {} : data;
};

const _addSync = function(context, sync, syncs) {
  var existingSyncs = syncs.get(context) || [];
  existingSyncs.push(sync);
  syncs.set(context, existingSyncs);
};

const _throwError = function(msg, code) {
  var err = new Error(`REBASE: ${msg}`);
  err.code = code;
  throw err;
};

const _setState = function(newState) {
  this.setState(newState);
};

const _returnRef = function(endpoint, method, id, context) {
  return { endpoint, method, id, context };
};

const _addQueries = function(ref, queries) {
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

const _addFirestoreQuery = function(ref, query) {
  if (query) {
    return query(ref);
  }
  return ref;
};

const _createHash = function(endpoint, invoker) {
  var hash = 0;
  var str = endpoint + invoker + Math.random();
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

const _firebaseRefsMixin = function(id, ref, refs) {
  refs.set(id, ref);
};

const _handleError = function(onFailure, err) {
  if (err && typeof onFailure === 'function') {
    onFailure(err);
  }
};

const _setUnmountHandler = function(context, id, refs, listeners, syncs) {
  var removeListeners = () => {
    _removeBinding({ context, id }, { refs, listeners, syncs });
  };
  if (typeof context.componentWillUnmount === 'function') {
    var unmount = context.componentWillUnmount;
  }
  context.componentWillUnmount = function() {
    removeListeners();
    if (unmount) unmount.call(context);
  };
};

const _fsSetUnmountHandler = function(context, id, refs, listeners, syncs) {
  var removeListeners = () => {
    _fsRemoveBinding({ context, id }, { refs, listeners, syncs });
  };
  if (typeof context.componentWillUnmount === 'function') {
    var unmount = context.componentWillUnmount;
  }
  context.componentWillUnmount = function() {
    removeListeners();
    if (unmount) unmount.call(context);
  };
};

const _setData = function(ref, data, handleError, keepKeys) {
  if (Array.isArray(data) && keepKeys) {
    var shouldConvertToObject = data.reduce((acc, curr) => {
      return acc ? acc : _isObject(curr) && curr.hasOwnProperty('key');
    }, false);
    if (shouldConvertToObject) {
      data = data.reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {});
    }
  }
  ref.set(data, handleError);
};

const _updateSyncState = function(ref, onFailure, keepKeys, data) {
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

const _fsUpdateSyncState = function(ref, data) {
  ref.set(data);
};

const _addListener = function _addListener(
  id,
  invoker,
  options,
  ref,
  listeners
) {
  ref = _addQueries(ref, options.queries);
  const boundOnFailure =
    typeof options.onFailure === 'function'
      ? options.onFailure.bind(options.context)
      : null;
  listeners.set(
    id,
    ref.on(
      'value',
      snapshot => {
        const data = _prepareData(snapshot, options);
        if (invoker === 'listenTo') {
          options.then.call(options.context, data);
        } else {
          let newState = { [options.state]: data };
          if (_isNestedPath(options.state)) {
            const root = options.state.split('.')[0];
            // Merge the previous state with the new one
            let prevState = { [root]: options.context.state[root] };
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
      },
      boundOnFailure
    )
  );
};

const _addFirestoreListener = function _addFirestoreListener(
  id,
  invoker,
  options,
  ref,
  listeners
) {
  ref = _addFirestoreQuery(ref, options.query);
  const boundOnFailure =
    typeof options.onFailure === 'function'
      ? options.onFailure.bind(options.context)
      : undefined;
  listeners.set(
    id,
    ref.onSnapshot(snapshot => {
      if (invoker.match(/^listenTo/)) {
        if (invoker === 'listenToDoc') {
          let newState = _fsPrepareData(snapshot, options);
          return options.then.call(options.context, newState);
        }
        if (invoker === 'listenToCollection') {
          let newState = _fsPrepareData(snapshot, options, true);
          return options.then.call(options.context, newState);
        }
      } else {
        if (invoker === 'syncDoc') {
          let newState = _fsPrepareData(snapshot, options);
          options.reactSetState.call(options.context, function(currentState) {
            return Object.assign(currentState, newState);
          });
        } else if (invoker === 'bindDoc') {
          let newState = _fsPrepareData(snapshot, options);
          _setState.call(options.context, function(currentState) {
            return Object.assign(currentState, newState);
          });
        } else if (invoker === 'bindCollection') {
          let newState = _fsPrepareData(snapshot, options, true);
          _setState.call(options.context, function(currentState) {
            return Object.assign(currentState, newState);
          });
        }
        if (options.then && options.then.called === false) {
          options.then.call(options.context);
          options.then.called = true;
        }
      }
    }, boundOnFailure)
  );
};

const _getSegmentCount = function(path) {
  return path.match(/^\//)
    ? path.split('/').slice(1).length
    : path.split('/').length;
};

const _fsPrepareData = function(snapshot, options, isCollection = false) {
  let meta = {};
  if (!isCollection) {
    let data = {};
    if (snapshot.exists) {
      if (options.withRefs) meta.ref = snapshot.ref;
      if (options.withIds) meta.id = snapshot.id;
      data = snapshot.data();
    } else {
      data = {};
    }
    return options.state
      ? { [options.state]: Object.assign({}, data, meta) }
      : Object.assign({}, data, meta);
  }
  const collection = [];
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      if (options.withRefs) meta.ref = doc.ref;
      if (options.withIds) meta.id = doc.id;
      collection.push(Object.assign({}, doc.data(), meta));
    });
  }
  return options.state ? { [options.state]: collection } : collection;
};

const _fsCreateRef = function(pathOrRef, db) {
  if (typeof pathOrRef === 'object') {
    return pathOrRef;
  }
  const segmentCount = _getSegmentCount(pathOrRef);
  var ref;
  if (segmentCount % 2 === 0) {
    ref = db.doc(pathOrRef);
  } else {
    ref = db.collection(pathOrRef);
  }
  return ref;
};

export {
  _createHash,
  _addQueries,
  _addFirestoreQuery,
  _returnRef,
  _setState,
  _throwError,
  _prepareData,
  _fsPrepareData,
  _toArray,
  _isValid,
  _isObject,
  _isNestedPath,
  _getNestedObject,
  _getSegmentCount,
  _hasOwnNestedProperty,
  _addSync,
  _firebaseRefsMixin,
  _updateSyncState,
  _fsUpdateSyncState,
  _addListener,
  _addFirestoreListener,
  _setUnmountHandler,
  _createNestedObject,
  _handleError,
  _setData,
  _fsSetUnmountHandler,
  _fsCreateRef
};
