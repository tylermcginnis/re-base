import { _addScope, _throwError } from '../utils';
import { auth as FirebaseAuth } from 'firebase';

function _getFacebookProvider(settings){
  var provider = new FirebaseAuth.FacebookAuthProvider();
  if(settings.scope){
    provider = _addScope(settings.scope, provider);
  }
  return provider;
}

function _getTwitterProvider(){
  return new FirebaseAuth.TwitterAuthProvider();
}

function _getGithubProvider(settings){
  var provider = new FirebaseAuth.GithubAuthProvider();
  if(settings.scope){
    provider = _addScope(settings.scope, provider);
  }
  return provider;
};

function _getGoogleProvider(settings){
  var provider = new FirebaseAuth.GoogleAuthProvider();
  if(settings.scope){
    provider = _addScope(settings.scope, provider);
  }
  return provider;
};

export default function _getAuthProvider(service, settings){
  switch(service){
    case 'twitter':
      return _getTwitterProvider();
    break;
    case 'google':
      return _getGoogleProvider(settings);
    break;
    case 'facebook':
      return _getFacebookProvider(settings);
    break;
    case 'github':
      return _getGithubProvider(settings);
    break;
    default:
      _throwError('Expected auth provider requested. Available auth providers: facebook,twitter,github, google','UNKNOWN AUTH PROVIDER');
    break;
  }
};
