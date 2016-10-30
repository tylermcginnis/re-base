import {
  _throwError
} from '../utils';

export default function _removeBinding({endpoint, method, id, context }, {refs, listeners, syncs}){
  var ref = refs.get(id);
  var listener = listeners.get(id);
  if (typeof ref === "undefined") {
    var errorMsg = `Unexpected value. Ref was either never bound or has already been unbound.`;
    _throwError(errorMsg, "UNBOUND_ENDPOINT_VARIABLE");
  }
  ref.off('value', listener);
  refs.delete(id);
  listeners.delete(id);
  var currentSyncs = syncs.get(context);
  if(currentSyncs && currentSyncs.length > 0){
    var idx = currentSyncs.findIndex((item,index) => {
      return item.id === id;
    });
    if(idx !== -1){
      currentSyncs.splice(idx,1);
      syncs.set(context, currentSyncs);
    }
  }
};
