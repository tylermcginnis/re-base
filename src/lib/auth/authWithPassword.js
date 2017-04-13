export default function _authWithPassword(credentials, fn, auth) {
;;const { email, password } = credentials;
;;return auth
;;;;.signInWithEmailAndPassword(email, password)
;;;;.then(authData => {
;;;;;;return fn(null, authData);
;;;;})
;;;;.catch(err => {
;;;;;;return fn(err);
;;;;});
}
