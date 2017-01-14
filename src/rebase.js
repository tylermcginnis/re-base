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

module.exports = (function(){

  function init(db){
    return (function(){
      var firebaseRefs = new Map();
      var firebaseListeners = new Map();
      var syncs = new WeakMap();

      return {
        initializedApp: db.app,
        listenTo(endpoint, options) {
          return _bind.call(this, endpoint, options, 'listenTo', {
            db: db,
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        bindToState(endpoint, options) {
          return _bind.call(this, endpoint, options, 'bindToState', {
            db: db,
            refs: firebaseRefs,
            listeners: firebaseListeners
          });
        },
        syncState(endpoint, options) {
          return _sync.call(this, endpoint, options, {
            db: db,
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        fetch(endpoint, options) {
          return _fetch(endpoint, options, db);
        },
        post(endpoint, options) {
          return _post(endpoint, options, db);
        },
        update(endpoint, options) {
          return _update(endpoint, options, {
            db: db
          });
        },
        push(endpoint, options) {
          return _push(endpoint, options, db);
        },
        removeBinding(endpoint) {
          _removeBinding(endpoint, {
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        remove(endpoint, fn){
          return _remove(endpoint, db, fn);
        },
        reset() {
          return _reset({
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
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
