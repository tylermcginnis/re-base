import _getAuthProvider from './getAuthProvider';

export default function _authWithOAuthPopup(provider, fn, settings, auth){
  settings = settings || {};
  var authProvider = _getAuthProvider(provider, settings);
  return auth.signInWithPopup(authProvider).then(authData => {
      return fn(null, authData);
  }).catch(error => {
      return fn(error);
  });
}
