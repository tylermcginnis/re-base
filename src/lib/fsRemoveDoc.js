export default function _fsRemoveDoc(path, db) {
  return db.doc(path).delete();
}
