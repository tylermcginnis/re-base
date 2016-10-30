export default function _createUser(credentials, fn, auth){
  const { email, password } = credentials;
  return auth().createUserWithEmailAndPassword(email,password).then(authData => {
    return fn(null, authData);
  }).catch(err => {
    return fn(err);
  });
};
