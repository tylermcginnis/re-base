exports.mockSnapshot = object => {
  //set up snapshot
  var snapshot = {
    data: object,
    forEach(fn) {
      Object.keys(this.data).forEach(key => {
        fn({
          val: () => {
            return { [key]: this.data[key] };
          },
          key: key
        });
      });
    },
    val() {
      return this.data;
    }
  };
  return snapshot;
};

exports.mockSyncs = data => new WeakMap(data);

exports.mockRefs = data => new Map(data);

exports.mockListeners = data => new Map(data);

exports.mockRef = () => {
  return {
    off() {},
    on() {},
    set() {},
    child(prop) {
      return this;
    }
  };
};

exports.mockSync = data => ({
  id: data.id,
  updateFirebase: data.updateFirebase,
  stateKey: data.state
});

exports.mockCollection = () => ({
  onSnapshot() {},
  get() {},
  add() {},
  doc() {}
});

exports.mockDoc = unsubscribeSpy => ({
  onSnapshot() {
    return unsubscribeSpy;
  },
  get() {},
  add() {},
  doc() {}
});
