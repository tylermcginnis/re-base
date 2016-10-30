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

  var ref = state.db().ref(endpoint);
  var id = _createHash(endpoint, 'syncState');
  _firebaseRefsMixin(id, ref, state.refs);
  _addListener(id, 'syncState', options, ref, state.listeners);

  var sync = {
    id: id,
    updateFirebase: _updateSyncState.bind(this, ref),
    stateKey: options.state
  }
  _addSync(options.context, sync, state.syncs);

  options.context.setState = function(data,cb){
    var syncsToCall = state.syncs.get(this);
    syncsToCall.forEach(sync => {
      for (var key in data) {
        if (data.hasOwnProperty(key)){
          if (key === sync.stateKey) {
            sync.updateFirebase(data[key]);
          } else {
            _sync.reactSetState.call(this, data, cb);
          }
        }
      }
    });
  }
  return _returnRef(endpoint, 'syncState', id, options.context);
};
