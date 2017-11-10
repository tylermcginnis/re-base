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
  _fsCreateRef
} from './utils';

export default function _fsBind(path, options, invoker, state) {
  optionValidators.context(options);
  options.then && (options.then.called = false);
  if (invoker === 'bindDoc') {
    _validateDocumentPath(path);
  }
  if (invoker === 'bindCollection') {
    optionValidators.state(options);
    _validateCollectionPath(path);
  }
  if (invoker === 'listenToDoc') {
    _validateDocumentPath(path);
    optionValidators.then(options);
  }
  if (invoker === 'listenToCollection') {
    _validateCollectionPath(path);
    optionValidators.then(options);
  }
  const ref = _fsCreateRef(path, state.db);
  var id = _createHash(path, invoker);
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
