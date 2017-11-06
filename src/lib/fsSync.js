import { _validateDocumentPath, optionValidators } from './validators';
import {
  _returnRef,
  _createHash,
  _fsSetUnmountHandler,
  _firebaseRefsMixin,
  _addListener,
  _addSync,
  _addFirestoreListener,
  _fsUpdateSyncState,
  _isNestedPath,
  _getNestedObject,
  _hasOwnNestedProperty
} from './utils';

export default function _fsSync(document, options, state) {
  //validate arguments
  _validateDocumentPath(document);
  optionValidators.context(options);
  optionValidators.state(options);
  options.then && (options.then.called = false);
  //store reference to react's setState
  if (_fsSync.called !== true) {
    _fsSync.reactSetState = options.context.setState;
    _fsSync.called = true;
  }
  options.reactSetState = _fsSync.reactSetState;

  const id = _createHash(document, 'syncDoc');
  const ref = state.db.doc(document);
  _firebaseRefsMixin(id, ref, state.refs);
  _addFirestoreListener(id, 'syncDoc', options, ref, state.listeners);
  _fsSetUnmountHandler(
    options.context,
    id,
    state.refs,
    state.listeners,
    state.syncs
  );
  var sync = {
    id: id,
    updateFirebase: _fsUpdateSyncState.bind(null, ref),
    stateKey: options.state
  };
  _addSync(options.context, sync, state.syncs);
  options.context.setState = function(data, cb) {
    //if setState is a function, call it first before syncing to fb
    if (typeof data === 'function') {
      return _fsSync.reactSetState.call(options.context, data, () => {
        if (cb) cb.call(options.context);
        return options.context.setState.call(
          options.context,
          options.context.state
        );
      });
    }
    //if callback is supplied, call setState first before syncing to fb
    if (typeof cb === 'function') {
      return _fsSync.reactSetState.call(options.context, data, () => {
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
    var syncedKeys = syncsToCall.map(sync => {
      return {
        key: sync.stateKey,
        update: sync.updateFirebase
      };
    });
    syncedKeys.forEach(syncedKey => {
      if (data[syncedKey.key]) {
        syncedKey.update(data[syncedKey.key]);
      }
    });
    //send the update of all other keys through setState
    var allKeys = Object.keys(data);
    allKeys.forEach(key => {
      var absent = !syncedKeys.find(syncedKey => {
        return syncedKey.key === key;
      });
      if (absent) {
        var update = {};
        update[key] = data[key];
        _fsSync.reactSetState.call(
          options.context,
          function(currentState) {
            return Object.assign(currentState, update);
          },
          cb
        );
      }
    });
  };
  return _returnRef(document, 'syncDoc', id, options.context);
}
