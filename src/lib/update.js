import { _validateEndpoint, optionValidators } from './validators';

export default function _update(endpoint, options, state) {
  _validateEndpoint(endpoint);
  optionValidators.data(options);
  var ref = state.db.ref(endpoint);
  if (options.then) {
    return ref.update(options.data, options.then);
  } else {
    return ref.update(options.data);
  }
}
