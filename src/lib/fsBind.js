import { optionValidators, _validateDocumentPath } from './validators';
import {
  _createHash,
  _returnRef,
  _firebaseRefsMixin,
  _addFirestoreListener,
  _fsSetUnmountHandler,
  _getSegmentCount
} from './utils';

export default function _fsBind(path, options, invoker, state) {
  _validateDocumentPath(path);
  optionValidators.context(options);
  invoker === 'listen' && optionValidators.then(options);
  if (invoker === 'bindDoc') {
    optionValidators.state(options);
    _validateDocumentPath(path);
  }
  options.queries && optionValidators.query(options);
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
