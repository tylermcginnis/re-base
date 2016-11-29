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

const _updateSyncState = function (ref, onFailure, data){
  if(_isObject(data)) {
    for(var prop in data){
      //allow timestamps to be set
        if(prop !== '.sv'){
            _updateSyncState(ref.child(prop), onFailure, data[prop]);
        } else {
          ref.set(data, _handleError.bind(null, onFailure));
        }
      }
  } else {
    ref.set(data, _handleError.bind(null, onFailure));
  }
};

const _addListener = function _addListener(id, invoker, options, ref, listeners){
  ref = _addQueries(ref, options.queries);
  listeners.set(id, ref.on('value', (snapshot) => {
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
  }, options.onFailure));
};

export {
  _addScope,
  _createHash,
  _addQueries,
  _returnRef,
  _setState,
  _throwError,
  _toArray,
  _isObject,
  _addSync,
  _firebaseRefsMixin,
  _updateSyncState,
  _addListener
}
