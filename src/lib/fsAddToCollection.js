import { _validateCollectionPath } from './validators';
import { _fsCreateRef } from './utils';

export default function _fsAddToCollection(path, doc, db, key) {
  _validateCollectionPath(path);
  const ref = _fsCreateRef(path, db);
  if (key) {
    return ref.doc(key).set(doc);
  }
  return ref.add(doc);
}
