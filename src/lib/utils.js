const _isObject = function (obj){
    return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
};

const _toArray = function (snapshot){
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

const _prepareData = function (snapshot, options = {}){
  const {isNullable, asArray} = options;
  const data = snapshot.val();
  if(~['number', 'boolean'].indexOf(typeof data)) return data;
  if(isNullable === true && data === null) return null;
  if(asArray === true) return _toArray(snapshot);
  return data === null ? (asArray === true ? [] : {}) : data;
};

const _addSync = function (context, sync, syncs){
  var existingSyncs = syncs.get(context) || [];
  existingSyncs.push(sync);
  syncs.set(context, existingSyncs);
}

const _throwError = function (msg, code){
  var err = new Error(`REBASE: ${msg}`);
  err.code = code;
  throw err;
};

const _setState = function (newState){
  this.setState(newState);
};

const _returnRef = function (endpoint, method, id, context){
  return { endpoint, method, id, context };
};

const _addQueries = function (ref, queries){
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

const _createHash = function (endpoint, invoker){
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

const _addScope = function (scope, provider){
  if(Array.isArray(scope)){
    scope.forEach(item => {
        provider.addScope(item);
    });
  } else {
      provider.addScope(scope);
  }
  return provider;
}

const _firebaseRefsMixin = function (id, ref, refs){
  refs.set(id, ref);
};

const _handleError = function(onFailure, err){
  if(err && typeof onFailure === 'function'){
    onFailure(err);
  }
}

const _setData = function(ref, data, handleError, keepKeys){
    if(Array.isArray(data) && keepKeys){
      var shouldConvertToObject = data.reduce((acc, curr) => {
        return acc ? acc : _isObject(curr) && curr.hasOwnProperty('key');
      }, false);
      if(shouldConvertToObject){
        data = data.reduce((acc, item ) => {
          acc[item.key] = item;
          return acc;
        }, {});
      }
    }
    ref.set(data, handleError);
}

const _updateSyncState = function (ref, onFailure, keepKeys, data){
  if(_isObject(data)) {
    for(var prop in data){
      //allow timestamps to be set
        if(prop !== '.sv'){
            _updateSyncState(ref.child(prop), onFailure, keepKeys, data[prop]);
        } else {
          _setData(ref, data, _handleError.bind(null, onFailure), keepKeys);
        }
      }
  } else {
    _setData(ref, data, _handleError.bind(null, onFailure), keepKeys);
  }
};

const _addListener = function _addListener(id, invoker, options, ref, listeners){
  ref = _addQueries(ref, options.queries);
  listeners.set(id, ref.on('value', (snapshot) => {
    const data = _prepareData(snapshot, options);
    if(invoker === 'listenTo'){
      options.then.call(options.context, data);
    } else if(invoker === 'syncState'){
        options.reactSetState.call(options.context, {[options.state]: data});
        if(options.then && options.then.called === false){
          options.then.call(options.context);
          options.then.called = true;
        }
    } else if(invoker === 'bindToState') {
        var newState = {[options.state]: data};
        _setState.call(options.context, newState);
        if(options.then && options.then.called === false){
          options.then.call(options.context);
          options.then.called = true;
        }
    }
  }, options.onFailure));
};

export {
  _addScope,
  _createHash,
  _addQueries,
  _returnRef,
  _setState,
  _throwError,
  _prepareData,
  _toArray,
  _isObject,
  _addSync,
  _firebaseRefsMixin,
  _updateSyncState,
  _addListener
}
