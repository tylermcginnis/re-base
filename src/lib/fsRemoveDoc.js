import { _fsCreateRef } from './utils';
export default function _fsRemoveDoc(path, db) {
  const ref = _fsCreateRef(path, db);
  return ref.delete();
}
