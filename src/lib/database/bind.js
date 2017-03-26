import { optionValidators, _validateEndpoint } from '../validators';
import {
  _createHash,
  _returnRef,
  _firebaseRefsMixin,
  _addListener
} from '../utils';

export default function _bind(endpoint, options, invoker, state){
  _validateEndpoint(endpoint);
  optionValidators.context(options);
  optionValidators.asString(options);
  invoker === 'listenTo' && optionValidators.then(options);
  invoker === 'bindToState' && optionValidators.state(options);
  options.queries && optionValidators.query(options);
  options.then && (options.then.called = false);

  var id = _createHash(endpoint, invoker);
  var ref = state.db.ref(endpoint);
  _firebaseRefsMixin(id, ref, state.refs);
  _addListener(id, invoker, options, ref, state.listeners);
  return _returnRef(endpoint, invoker, id, options.context);
};
