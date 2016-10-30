import firebase from 'firebase';

//helpers
import { throwError } from './lib/utils';
import { _validateConfig } from './lib/validators';

//database
import _push from './lib/database/push';
import _fetch from './lib/database/fetch';
import _post from './lib/database/post';
import _sync from './lib/database/sync';
import _bind from './lib/database/bind';
import _update from './lib/database/update';
import _reset from './lib/database/reset';
import _removeBinding from './lib/database/removeBinding';

//user
import _resetPassword from './lib/user/resetPassword';
import _createUser from './lib/user/createUser';

//auth
import _authWithPassword from './lib/auth/authWithPassword';
import _authWithCustomToken from './lib/auth/authWithCustomToken';
import _authWithOAuthPopup from './lib/auth/authWithOAuthPopup';
import _getOAuthRedirectResult from './lib/auth/getOAuthRedirectResult';
import _authWithOAuthToken from './lib/auth/authWithOAuthToken';
import _authWithOAuthRedirect from './lib/auth/authWithOAuthToken';
import _onAuth from './lib/auth/onAuth';
import _unauth from './lib/auth/unauth';
import _getAuth from './lib/auth/getAuth';

module.exports = (function(){

  var apps = {};

  function init(app){
    return (function(){
      var firebaseRefs = new Map();
      var firebaseListeners = new Map();
      var syncs = new WeakMap();

      return {
        name: app.name,
        storage : app.storage,
        database: app.database,
        auth: app.auth,
        app: app,
        ServerValue: firebase.database.ServerValue,
        listenTo(endpoint, options) {
          return _bind.call(this, endpoint, options, 'listenTo', {
            db: this.database,
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        bindToState(endpoint, options) {
          return _bind.call(this, endpoint, options, 'bindToState', {
            db: this.database,
            refs: firebaseRefs,
            listeners: firebaseListeners
          });
        },
        syncState(endpoint, options) {
          return _sync.call(this, endpoint, options, {
            db: this.database,
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        fetch(endpoint, options) {
          return _fetch(endpoint, options, this.database);
        },
        post(endpoint, options) {
          return _post(endpoint, options, this.database);
        },
        update(endpoint, options) {
          return _update(endpoint, options, {
            db: this.database
          });
        },
        push(endpoint, options) {
          return _push(endpoint, options, this.database);
        },
        removeBinding(endpoint) {
          _removeBinding(endpoint, {
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        reset() {
          return _reset({
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        authWithPassword(credentials, fn) {
          return _authWithPassword(credentials, fn, this.auth);
        },
        authWithCustomToken(token, fn) {
          return _authWithCustomToken(token, fn, this.auth);
        },
        authWithOAuthPopup(provider, fn, settings) {
          return _authWithOAuthPopup(provider, fn, settings, this.auth);
        },
        authWithOAuthRedirect(provider, fn, settings) {
          return _authWithOAuthRedirect(provider, fn, settings, this.auth);
        },
        authWithOAuthToken(provider, token, fn, settings) {
          return _authWithOAuthToken(provider, token, fn, settings, this.auth);
        },
        authGetOAuthRedirectResult(fn) {
          return _getOAuthRedirectResult(fn, this.auth);
        },
        onAuth(fn) {
          return _onAuth(fn, this.auth);
        },
        unauth(fn) {
          return _unauth(this.auth);
        },
        getAuth() {
          return _getAuth(this.auth);
        },
        createUser(credentials,fn) {
          return _createUser(credentials, fn, this.auth);
        },
        resetPassword(credentials,fn) {
          return _resetPassword(credentials, fn, this.auth);
        },
        delete(fn) {
          delete apps[this.name];
          return this.app.delete().then(() => {
            this.reset();
            if(typeof fn === 'function'){
              fn.call(null, true);
            } else {
              return firebase.Promise.resolve(true);
            }
          });
        }
      }
    })();
  };

  return {
    createClass(config, name = '[DEFAULT]'){
      if(typeof apps[name] !== 'undefined'){
        return apps[name];
      } else {
        _validateConfig(config);
        var app = firebase.initializeApp(config, name);
      }
      apps[name] = init(app);
      return apps[name];
    }
  };
})();
