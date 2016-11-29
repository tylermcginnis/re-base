import { _validateEndpoint, optionValidators } from '../validators';

import {
  _createHash,
  _firebaseRefsMixin,
  _updateSyncState,
  _addSync,
  _returnRef,
  _addListener
} from '../utils';

export default function _sync(endpoint, options, state){
  _validateEndpoint(endpoint);
  optionValidators.context(options);
  optionValidators.state(options);
  options.queries && optionValidators.query(options);
  options.then && (options.then.called = false);

  //store reference to react's setState
  if(_sync.called !== true){
    _sync.reactSetState = options.context.setState;
    _sync.called = true;
  }
  options.reactSetState = _sync.reactSetState;

  var ref = state.db.ref(endpoint);
  var id = _createHash(endpoint, 'syncState');
  _firebaseRefsMixin(id, ref, state.refs);
  _addListener(id, 'syncState', options, ref, state.listeners);

  options.onFailure = options.onFailure ? options.onFailure : () => {};
  var sync = {
    id: id,
    updateFirebase: _updateSyncState.bind(null, ref, options.onFailure),
    stateKey: options.state
  }
  _addSync(options.context, sync, state.syncs);

  options.context.setState = function(data,cb){
    var syncsToCall = state.syncs.get(this);
    //if sync does not exist, call original Component.setState
    if(!syncsToCall || syncsToCall.length === 0){
      return _sync.reactSetState.call(this, data, cb);
    }
    var syncedKeys = syncsToCall.map(sync => {
      return {
        key : sync.stateKey,
        update: sync.updateFirebase
      }
    });
    syncedKeys.forEach( syncedKey => {
      if(data.hasOwnProperty(syncedKey.key)){
        syncedKey.update(data[syncedKey.key]);
      }
    });
    var allKeys = Object.keys(data);
    allKeys.forEach(key => {
      if(!syncedKeys.find(syncedKey => syncedKey.key === key)){
        var update = {};
        update[key] = data[key];
        _sync.reactSetState.call(options.context, update, cb);
      }
    });
  }
  return _returnRef(endpoint, 'syncState', id, options.context);
};
