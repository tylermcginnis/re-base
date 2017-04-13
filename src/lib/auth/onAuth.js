export default function _onAuth(fn, auth) {
  return auth.onAuthStateChanged(fn);
}
