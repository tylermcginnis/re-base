//helpers
import { throwError } from './lib/utils';
import { _validateDatabase } from './lib/validators';

//database
import _push from './lib/push';
import _fetch from './lib/fetch';
import _post from './lib/post';
import _sync from './lib/sync';
import _bind from './lib/bind';
import _update from './lib/update';
import _reset from './lib/reset';
import _removeBinding from './lib/removeBinding';
import _remove from './lib/remove';

module.exports = (function() {
  function init(db) {
    return (function() {
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
        removeBinding(binding) {
          _removeBinding(binding, {
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        },
        remove(endpoint, fn) {
          return _remove(endpoint, db, fn);
        },
        reset() {
          return _reset({
            refs: firebaseRefs,
            listeners: firebaseListeners,
            syncs: syncs
          });
        }
      };
    })();
  }

  return {
    createClass(db) {
      _validateDatabase(db);
      return init(db);
    }
  };
})();
