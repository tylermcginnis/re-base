export default function _fsReset(state) {
  state.listeners.forEach((unsubscribe, id) => {
    unsubscribe();
  });
  state.listeners = new Map();
  state.refs = new Map();
  state.syncs = new WeakMap();
  return null;
}
