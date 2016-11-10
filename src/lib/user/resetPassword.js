export default function _resetPassword(credentials, fn, auth){
  const { email } = credentials;
  return auth.sendPasswordResetEmail(email).then(() => {
     return fn(null);
  }).catch(error => {
     return fn(error);
  });
};
