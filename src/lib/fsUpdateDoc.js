import { _validateDocumentPath } from './validators';
import { _fsCreateRef } from './utils';
export default function _fsUpdateDoc(document, data, db) {
  _validateDocumentPath(document);
  const ref = _fsCreateRef(document, db);
  return ref.update(data);
}
