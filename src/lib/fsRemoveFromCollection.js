import { _validateCollectionPath } from './validators';
import { _addFirestoreQuery } from './utils';

export default function _fsRemoveFromCollection(path, db, options = {}) {
  _validateCollectionPath(path);
  let ref = db.collection(path);
  ref = _addFirestoreQuery(ref, options.query);
  return ref.get().then(snapshot => {
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    }
  });
}
