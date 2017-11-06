import {
  optionValidators,
  _validateDocumentPath,
  _validateCollectionPath
} from './validators';
import {
  _createHash,
  _returnRef,
  _firebaseRefsMixin,
  _addFirestoreListener,
  _fsSetUnmountHandler,
  _getSegmentCount
} from './utils';

export default function _fsBind(path, options, invoker, state) {
  optionValidators.context(options);
  if (invoker === 'bindDoc') {
    _validateDocumentPath(path);
  }
  if (invoker === 'bindCollection') {
    optionValidators.state(options);
    _validateCollectionPath(path);
  }
  invoker === 'listen' && optionValidators.then(options);

  options.then && (options.then.called = false);

  var id = _createHash(path, invoker);
  const segmentCount = _getSegmentCount(path);
  var ref;
  if (segmentCount % 2 === 0) {
    ref = state.db.doc(path);
  } else {
    ref = state.db.collection(path);
  }
  _firebaseRefsMixin(id, ref, state.refs);
  _addFirestoreListener(id, invoker, options, ref, state.listeners);
  _fsSetUnmountHandler(
    options.context,
    id,
    state.refs,
    state.listeners,
    state.syncs
  );
  return _returnRef(path, invoker, id, options.context);
}
