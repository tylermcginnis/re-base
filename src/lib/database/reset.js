export default function _reset(state){
  state.refs.forEach((ref, id) => {
    ref.off('value', state.listeners.get(id));
  });
  state.listeners = new Map();
  state.refs = new Map();
  state.syncs = new WeakMap();
  return null;
};
