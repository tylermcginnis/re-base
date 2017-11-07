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

//firestore
import _fsSync from './lib/fsSync';
import _fsRemoveBinding from './lib/fsRemoveBinding';
import _fsBind from './lib/fsBind';
import _fsGet from './lib/fsGet';
import _fsRemoveDoc from './lib/fsRemoveDoc';
import _fsAddToCollection from './lib/fsAddToCollection';
import _fsRemoveFromCollection from './lib/fsRemoveFromCollection';

module.exports = (function() {
  function init(db) {
    return (function() {
      var refs = new Map();
      var listeners = new Map();
      var syncs = new WeakMap();

      if (typeof db.ref === 'function') {
        var rebase = {
          initializedApp: db.app,
          listenTo(endpoint, options) {
            return _bind.call(this, endpoint, options, 'listenTo', {
              db,
              refs,
              listeners,
              syncs
            });
          },
          bindToState(endpoint, options) {
            return _bind.call(this, endpoint, options, 'bindToState', {
              db,
              refs,
              listeners
            });
          },
          syncState(endpoint, options) {
            return _sync.call(this, endpoint, options, {
              db,
              refs,
              listeners,
              syncs
            });
          },
          fetch(endpoint, options) {
            return _fetch(endpoint, options, db);
          },
          post(endpoint, options) {
            return _post(endpoint, options, db);
          },
          update(endpoint, options) {
            return _update(endpoint, options, { db });
          },
          push(endpoint, options) {
            return _push(endpoint, options, db);
          },
          removeBinding(binding) {
            _removeBinding(binding, {
              refs,
              listeners,
              syncs
            });
          },
          remove(endpoint, fn) {
            return _remove(endpoint, db, fn);
          },
          reset() {
            return _reset({
              refs,
              listeners,
              syncs
            });
          }
        };
      } else {
        var rebase = {
          initializedApp: db.app,
          bindDoc(path, options) {
            return _fsBind.call(this, path, options, 'bindDoc', {
              db,
              refs,
              listeners
            });
          },
          bindCollection(path, options) {
            return _fsBind.call(this, path, options, 'bindCollection', {
              db,
              refs,
              listeners
            });
          },
          syncDoc(doc, options) {
            return _fsSync.call(this, doc, options, {
              db,
              refs,
              listeners,
              syncs
            });
          },
          listenToDoc(doc, options) {
            return _fsBind.call(this, doc, options, 'listenToDoc', {
              db,
              refs,
              listeners
            });
          },
          listenToCollection(path, options) {
            return _fsBind.call(this, path, options, 'listenToCollection', {
              db,
              refs,
              listeners
            });
          },
          addToCollection(path, doc, key) {
            return _fsAddToCollection.call(this, path, doc, db, key);
          },
          updateDoc(path, doc, key) {},
          get(path, options) {
            return _fsGet.call(this, path, options, db);
          },
          removeDoc(path) {
            return _fsRemoveDoc(path, db);
          },
          removeFromCollection(path, options) {
            return _fsRemoveFromCollection(path, db, options);
          },
          removeBinding(binding) {
            _fsRemoveBinding(binding, {
              refs,
              listeners,
              syncs
            });
          },
          reset() {
            return _reset({
              refs,
              listeners,
              syncs
            });
          }
        };
      }
      return rebase;
    })();
  }

  return {
    createClass(db) {
      _validateDatabase(db);
      return init(db);
    }
  };
})();
