exports.mockSnapshot = object => {
  //set up snapshot
  var snapshot = {
    data: object,
    forEach(fn) {
      var values;
      if (typeof this.data === 'object') {
        values = Object.keys(this.data);
      } else {
        values = Array.isArray(this.data) ? this.data : [this.data];
      }
      values.forEach(key => {
        fn({
          val: () => {
            if (this.data[key]) {
              return { [key]: this.data[key] };
            } else {
              return key;
            }
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

exports.mockFirestoreDocumentSnapshot = object => {
  //set up snapshot
  var snapshot = {
    data() {
      return object;
    },
    exists: true,
    id: '12345',
    ref: { _id: 'something' }
  };
  return snapshot;
};

exports.mockFirestoreQuerySnapshot = collection => {
  //set up snapshot
  var snapshot = {
    forEach(cb) {
      return collection.forEach(cb);
    },
    empty: collection.length
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

exports.mockFirestore = (docSpy, collectionSpy) => {
  return {
    doc: docSpy,
    collection: collectionSpy
  };
};
