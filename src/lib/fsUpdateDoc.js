import { _validateDocumentPath } from './validators';

export default function _fsUpdateDoc(document, data, db) {
  _validateDocumentPath(document);
  return db.doc(document).update(data);
}
