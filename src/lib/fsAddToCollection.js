import { _validateCollectionPath } from './validators';

export default function _fsAddToCollection(path, doc, db, key) {
  _validateCollectionPath(path);
  if (key) {
    return db
      .collection(path)
      .doc(key)
      .set(doc);
  }
  return db.collection(path).add(doc);
}
