export default function _fsRemoveBinding(
  { id, context },
  { refs, listeners, syncs }
) {
  var unsubscribe = listeners.get(id);
  if (typeof unsubscribe === 'function') {
    unsubscribe();
    refs.delete(id);
    listeners.delete(id);
    if (syncs) {
      var currentSyncs = syncs.get(context);
      if (currentSyncs && currentSyncs.length > 0) {
        var idx = currentSyncs.findIndex((item, index) => {
          return item.id === id;
        });
        if (idx !== -1) {
          currentSyncs.splice(idx, 1);
          syncs.set(context, currentSyncs);
        }
      }
    }
  }
}
