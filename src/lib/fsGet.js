import { _addFirestoreQuery, _fsPrepareData, _getSegmentCount } from './utils';
import { _validateEndpoint } from './validators';

export default function _fsGet(endpoint, options = {}, db) {
  _validateEndpoint(endpoint);
  const segmentCount = _getSegmentCount(endpoint);
  const isCollection = segmentCount % 2 !== 0;
  var ref;
  if (isCollection) {
    ref = db.collection(endpoint);
    ref = _addFirestoreQuery(ref, options.query);
  } else {
    ref = db.doc(endpoint);
  }
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
