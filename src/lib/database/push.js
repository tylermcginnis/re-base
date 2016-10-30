import firebase from 'firebase';
import { _validateEndpoint, optionValidators } from '../validators';

export default function _push(endpoint, options, db){
  _validateEndpoint(endpoint);
  optionValidators.data(options);
  var ref = db().ref(endpoint);
  var returnEndpoint;
  if(options.then){
    returnEndpoint = ref.push(options.data, options.then);
  } else {
    returnEndpoint = ref.push(options.data);
  }
  return returnEndpoint;
};
