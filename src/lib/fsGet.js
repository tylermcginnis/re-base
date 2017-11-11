import { _addFirestoreQuery, _fsPrepareData, _fsCreateRef } from './utils';
import { _validateEndpoint } from './validators';

export default function _fsGet(endpoint, options = {}, db) {
  _validateEndpoint(endpoint);
  let ref = _fsCreateRef(endpoint, db);
  //check if ref is a collection
  const isCollection = !!ref.add;
  ref = _addFirestoreQuery(ref, options.query);
  return ref.get().then(snapshot => {
    if (
      (isCollection && !snapshot.empty) ||
      (!isCollection && snapshot.exists)
    ) {
      return _fsPrepareData(snapshot, options, isCollection);
    } else {
      return Promise.reject(new Error('No Result'));
    }
  });
}
