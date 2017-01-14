import firebase from 'firebase';

//helpers
import { throwError } from './lib/utils';
import { _validateDatabase } from './lib/validators';

//database
import _push from './lib/database/push';
import _fetch from './lib/database/fetch';
import _post from './lib/database/post';
import _sync from './lib/database/sync';
import _bind from './lib/database/bind';
import _update from './lib/database/update';
import _reset from './lib/database/reset';
import _removeBinding from './lib/database/removeBinding';
import _remove from './lib/database/remove';

//user
import _resetPassword from './lib/user/resetPassword';
import _createUser from './lib/user/createUser';

//auth
import _authWithPassword from './lib/auth/authWithPassword';
import _authWithCustomToken from './lib/auth/authWithCustomToken';
import _authWithOAuthPopup from './lib/auth/authWithOAuthPopup';
import _getOAuthRedirectResult from './lib/auth/getOAuthRedirectResult';
import _authWithOAuthToken from './lib/auth/authWithOAuthToken';
import _authWithOAuthRedirect from './lib/auth/authWithOAuthRedirect';
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
        storage : firebase.storage,
        database: firebase.database,
        auth: firebase.auth,
        messaging: firebase.messaging,
        app: firebase.app,
        initializedApp: app,
        listenTo(endpoint, options) {
          return _bind.call(this, endpoint, options, 'listenTo', {
            db: this.database(this.initializedApp),
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        bindToState(endpoint, options) {
          return _bind.call(this, endpoint, options, 'bindToState', {
            db: this.database(this.initializedApp),
            refs: firebaseRefs,
            listeners: firebaseListeners
          });
        },
        syncState(endpoint, options) {
          return _sync.call(this, endpoint, options, {
            db: this.database(this.initializedApp),
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        fetch(endpoint, options) {
          return _fetch(endpoint, options, this.database(this.initializedApp));
        },
        post(endpoint, options) {
          return _post(endpoint, options, this.database(this.initializedApp));
        },
        update(endpoint, options) {
          return _update(endpoint, options, {
            db: this.database(this.initializedApp)
          });
        },
        push(endpoint, options) {
          return _push(endpoint, options, this.database(this.initializedApp));
        },
        removeBinding(endpoint) {
          _removeBinding(endpoint, {
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        remove(endpoint, fn){
          return _remove(endpoint, this.database(this.initializedApp), fn);
        },
        reset() {
          return _reset({
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        authWithPassword(credentials, fn) {
          return _authWithPassword(credentials, fn, this.auth(this.initializedApp));
        },
        authWithCustomToken(token, fn) {
          return _authWithCustomToken(token, fn, this.auth(this.initializedApp));
        },
        authWithOAuthPopup(provider, fn, settings) {
          return _authWithOAuthPopup(provider, fn, settings, this.auth(this.initializedApp));
        },
        authWithOAuthRedirect(provider, fn, settings) {
          return _authWithOAuthRedirect(provider, fn, settings, this.auth(this.initializedApp));
        },
        authWithOAuthToken(provider, token, fn, settings) {
          return _authWithOAuthToken(provider, token, fn, settings, this.auth(this.initializedApp));
        },
        authGetOAuthRedirectResult(fn) {
          return _getOAuthRedirectResult(fn, this.auth(this.initializedApp));
        },
        onAuth(fn) {
          return _onAuth(fn, this.auth(this.initializedApp));
        },
        unauth(fn) {
          return _unauth(this.auth(this.initializedApp));
        },
        getAuth() {
          return _getAuth(this.auth(this.initializedApp));
        },
        createUser(credentials,fn) {
          return _createUser(credentials, fn, this.auth(this.initializedApp));
        },
        resetPassword(credentials,fn) {
          return _resetPassword(credentials, fn, this.auth(this.initializedApp));
        },
        delete(fn) {
          delete apps[this.name];
          return this.initializedApp.delete().then(() => {
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
    createClass(db){
        _validateDatabase(db);
        return init(db);
    }
  };
})();
