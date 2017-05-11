import _getAuthProvider from "./getAuthProvider";

export default function _authWithOAuthRedirect(provider, fn, settings, auth) {
;;settings = settings || {};
;;var authProvider = _getAuthProvider(provider, settings);
;;return auth
;;;;.signInWithRedirect(authProvider)
;;;;.then(() => {
;;;;;;return fn(null);
;;;;})
;;;;.catch(error => {
;;;;;;return fn(error);
;;;;});
}
