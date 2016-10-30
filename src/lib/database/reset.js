export default function _reset(state){
  for (var [id, ref] of state.refs) {
    ref.off('value', state.listeners.get(id));
  }
  state.listeners = new Map();
  state.refs = new Map();
  state.syncs = new WeakMap();
  return null;
};
