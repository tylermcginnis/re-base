import _getAuthProvider from './getAuthProvider';

export default function _authWithOAuthToken(provider, token, fn, settings, auth){
  settings = settings || {};
  var authProvider = _getAuthProvider(provider, settings);
  var credential = authProvider.credential(token, ...settings.providerOptions);
  return auth.signInWithCredential(credential).then(authData => {
      return fn(null, authData);
  }).catch(error => {
      return fn(error);
  });
}
