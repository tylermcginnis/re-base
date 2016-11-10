export default function _authWithCustomToken(token, fn, auth){
  return auth.signInWithCustomToken(token).then((user) => {
    return fn(null, user);
  }).catch(error => {
    return fn(error);
  });
}
