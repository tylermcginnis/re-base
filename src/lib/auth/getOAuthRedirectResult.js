export default function _getOAuthRedirectResult(fn, auth){
  return auth.getRedirectResult().then((user) => {
      return fn(null, user);
  }).catch(error => {
      return fn(error);
  });
}
