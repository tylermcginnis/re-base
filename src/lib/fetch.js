import { _validateEndpoint, optionValidators } from './validators';
import { _addQueries, _toArray, _prepareData } from './utils';

export default function _fetch(endpoint, options, db){
  _validateEndpoint(endpoint);
  optionValidators.context(options);
  optionValidators.defaultValue(options);
  options.queries && optionValidators.query(options);
  var ref = db.ref(endpoint);
  ref = _addQueries(ref, options.queries);
  return ref.once('value').then(snapshot => {
    const data = _prepareData(snapshot, options);
    if(options.then){
      options.then.call(options.context, data);
    }
    return data;
  }).catch(err => {
    //call onFailure callback if it exists otherwise return a rejected promise
    if(options.onFailure && typeof options.onFailure === 'function'){
      options.onFailure.call(options.context, err);
    } else {
      throw err;
    }
  });
};
