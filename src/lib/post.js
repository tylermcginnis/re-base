import { _validateEndpoint, optionValidators } from './validators';

export default function _post(endpoint, options, db) {
  _validateEndpoint(endpoint);
  optionValidators.data(options);
  var ref = db.ref(endpoint);
  if (options.then) {
    return ref.set(options.data, options.then);
  } else {
    return ref.set(options.data);
  }
}
