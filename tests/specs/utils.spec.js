const {
  mockSnapshot,
  mockSyncs,
  mockRefs,
  mockListeners,
  mockRef,
  mockSync,
  mockCollection,
  mockDoc
} = require('../helpers');

describe('utils', () => {
  var utils;

  beforeEach(() => {
    utils = require('../../src/lib/utils');
  });
  afterEach(() => {
    utils = null;
  });
  describe('_isObject', () => {
    it('should return false if not object', () => {
      var result = utils._isObject('string');
      expect(result).toEqual(false);
    });

    it('should return true if an object', () => {
      var result = utils._isObject({});
      expect(result).toEqual(true);
    });
  });

  describe('_toArray', () => {
    it('should return an array from an object', () => {
      var snapshot = mockSnapshot({
        key1: 'value',
        key2: 'value',
        key3: 'value'
      });
      var result = utils._toArray(snapshot);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual({ key1: 'value', key: 'key1' });
    });

    it('should return an array from an object with nested data', () => {
      var snapshot = mockSnapshot({
        key1: { nKey1: 'value' }
      });
      var result = utils._toArray(snapshot);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({ key1: { nKey1: 'value' }, key: 'key1' });
    });
  });

  describe('_isValid', () => {
    it('should return true for strings ', () => {
      var result = utils._isValid('a string');
      expect(result).toBe(true);
    });
    it('should return true for objects', () => {
      var result = utils._isValid({});
      expect(result).toBe(true);
    });
    it('should return true for boolean', () => {
      var result = utils._isValid(false);
      expect(result).toBe(true);
    });
    it('should return true for numbers', () => {
      var result = utils._isValid(3);
      expect(result).toBe(true);
    });
    it('should return false for NaN', () => {
      var result = utils._isValid(NaN);
      expect(result).toBe(true);
    });
  });

  describe('_isNestedPath', () => {
    it('should return true for foo.bar', () => {
      var result = utils._isNestedPath('foo.bar');
      expect(result).toEqual(true);
    });
    it('should return false for foobar', () => {
      var result = utils._isNestedPath('foobar');
      expect(result).toEqual(false);
    });
  });

  describe('_createNestedObject', () => {
    it('should return nested object from path', () => {
      var fakeObj = {
        foo: {
          bar: {
            baz: undefined
          }
        }
      };
      var path = 'foo.bar.baz';
      var value = 5;
      var result = utils._createNestedObject(path, value, fakeObj);
      expect(result.foo.bar.baz).toEqual(value);
    });
    it('should not touch other paths', () => {
      var fakeObj = {
        foo: {
          boz: 12,
          bar: {
            baz: undefined
          }
        }
      };
      var path = 'foo.bar.baz';
      var value = 5;
      var result = utils._createNestedObject(path, value, fakeObj);
      expect(result.foo.boz).toEqual(12);
    });
  });

  describe('_getNestedObject', () => {
    it('should return the value for a path', () => {
      var fakeObj = {
        foo: {
          bar: {
            baz: 5
          },
          otherKey: {
            key1: 5
          }
        }
      };
      var result = utils._getNestedObject(fakeObj, 'foo.bar.baz');
      expect(result).toEqual(5);
    });

    it('should return undefined if there is no value at a path', () => {
      var fakeObj = {
        foo: {
          bar: {
            baz: 5
          },
          otherKey: {
            key1: 5
          }
        }
      };
      var result = utils._getNestedObject(fakeObj, 'foo.bar.nope');
      expect(result).toBeUndefined();
    });
  });

  describe('_hasOwnNestedProperty', () => {
    it('should return true if object contains path', () => {
      var fakeObj = {
        foo: {
          bar: {
            baz: 5
          },
          otherKey: {
            key1: 5
          }
        }
      };
      var result = utils._hasOwnNestedProperty(fakeObj, 'foo.bar.baz');
      expect(result).toEqual(true);
    });
    it('should return false if object does not contain path', () => {
      var fakeObj = {
        foo: {
          bar: {
            baz: 5
          },
          otherKey: {
            key1: 5
          }
        }
      };
      var result = utils._hasOwnNestedProperty(fakeObj, 'foo.bar.nope');
      expect(result).toEqual(false);
    });
  });

  describe('_prepareData()', () => {
    it('should return return an array if asArray option is true', () => {
      var snapshot = mockSnapshot({
        key1: 'value',
        key2: 'value',
        key3: 'value'
      });
      var options = {
        asArray: true
      };
      var result = utils._prepareData(snapshot, options);
      expect(Array.isArray(result)).toEqual(true);
      expect(result.length).toEqual(3);
    });

    it('should return return {} if defaultValue option is {} and value is null', () => {
      var snapshot = mockSnapshot(null);
      var options = {
        defaultValue: {}
      };
      var result = utils._prepareData(snapshot, options);
      expect(result).toEqual({});
    });

    it('should return return {} if defaultValue option is {} and value is null', () => {
      var snapshot = mockSnapshot(null);
      var options = {
        defaultValue: {}
      };
      var result = utils._prepareData(snapshot, options);
      expect(result).toEqual({});
    });

    it('should return return defaultValue option when snapshot value is null', () => {
      var snapshot = mockSnapshot(null);
      var options = {
        defaultValue: {}
      };
      var result = utils._prepareData(snapshot, options);
      expect(result).toEqual({});
    });

    it('should return return snapshot value', () => {
      var snapshot = mockSnapshot({
        key: 'value'
      });

      var result = utils._prepareData(snapshot);
      expect(result).toEqual({ key: 'value' });
    });
  });

  describe('_addSync', () => {
    it('should add a new sync to list of syncs for that context', () => {
      var syncs = mockSyncs();
      var context = {};
      var sync = () => {};
      var result = utils._addSync(context, sync, syncs);
      expect(syncs.get(context)[0]).toEqual(sync);
    });

    it('should append a new sync to existing list of syncs for that context', () => {
      var syncs = mockSyncs();
      var context = {};
      syncs.set(context, [function sync1() {}]);
      var sync = function sync2() {};
      var result = utils._addSync(context, sync, syncs);
      expect(syncs.get(context)[1]).toEqual(sync);
    });
  });

  describe('_throwError', () => {
    it('should throw specified error', () => {
      expect(() => {
        utils._throwError('Test Error', 'INVALID');
      }).toThrowError('REBASE: Test Error');
    });
  });

  describe('_setState', () => {
    it('should call setState with the correct context', () => {
      var context = {
        setState: () => {}
      };
      spyOn(context, 'setState');
      utils._setState.call(context, { key: 'value' });
      expect(context.setState).toHaveBeenCalledWith({ key: 'value' });
    });
  });

  describe('_returnRef', () => {
    it('should return an object with the supplied arguments', () => {
      var result = utils._returnRef(1, 2, 3, 4);
      expect(result.endpoint).toEqual(1);
      expect(result.method).toEqual(2);
      expect(result.id).toEqual(3);
      expect(result.context).toEqual(4);
    });
  });

  describe('_addQueries', () => {
    it('should add valid queries to the ref', () => {
      var ref = jasmine.createSpyObj([
        'limitToLast',
        'limitToFirst',
        'orderByChild',
        'startAt',
        'endAt',
        'equalTo'
      ]);
      ref.limitToFirst.and.returnValue(ref);
      ref.limitToLast.and.returnValue(ref);
      ref.equalTo.and.returnValue(ref);
      ref.orderByChild.and.returnValue(ref);
      ref.startAt.and.returnValue(ref);
      ref.endAt.and.returnValue(ref);
      var queries = {
        limitToLast: 10,
        equalTo: 'value',
        startAt: 4,
        endAt: 1,
        orderByChild: 'value',
        limitToFirst: 3
      };
      utils._addQueries(ref, queries);
      expect(ref.limitToLast).toHaveBeenCalledWith(10);
      expect(ref.equalTo).toHaveBeenCalledWith('value');
      expect(ref.orderByChild).toHaveBeenCalledWith('value');
      expect(ref.limitToFirst).toHaveBeenCalledWith(3);
      expect(ref.startAt).toHaveBeenCalledWith(4);
      expect(ref.endAt).toHaveBeenCalledWith(1);
    });
  });

  describe('_addFirestoreQuery', () => {
    it('should add valid queries to the ref', () => {
      var ref = jasmine.createSpyObj([
        'endAt',
        'endBefore',
        'limit',
        'orderBy',
        'startAt',
        'startAfter',
        'where'
      ]);
      ref.endAt.and.returnValue(ref);
      ref.endBefore.and.returnValue(ref);
      ref.limit.and.returnValue(ref);
      ref.orderBy.and.returnValue(ref);
      ref.startAt.and.returnValue(ref);
      ref.where.and.returnValue(ref);
      ref.startAfter.and.returnValue(ref);
      const query = ref => {
        return ref
          .endAt({})
          .startAt({})
          .where('key', '==', 'value')
          .limit(5)
          .orderBy('key')
          .endBefore({})
          .startAfter({});
      };
      utils._addFirestoreQuery(ref, query);
      expect(ref.endAt).toHaveBeenCalledWith({});
      expect(ref.startAt).toHaveBeenCalledWith({});
      expect(ref.endBefore).toHaveBeenCalledWith({});
      expect(ref.startAfter).toHaveBeenCalledWith({});
      expect(ref.where).toHaveBeenCalledWith('key', '==', 'value');
      expect(ref.orderBy).toHaveBeenCalledWith('key');
      expect(ref.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('_firebaseRefsMixin', () => {
    it('should add ref to refs', () => {
      var refs = mockRefs();
      var id = '1234';
      var ref = function testRef() {};
      utils._firebaseRefsMixin(id, ref, refs);
      expect(refs.size).toEqual(1);
    });
  });

  describe('_handleError', () => {
    it('should call error handler if there is an error', () => {
      var err = new Error('Test Error');
      var handler = jasmine.createSpy('onFailure');
      utils._handleError(handler, err);
      expect(handler).toHaveBeenCalledWith(err);
    });

    it('should not call error handler if there is no error', () => {
      var err = undefined;
      var handler = jasmine.createSpy('onFailure');
      utils._handleError(handler, err);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('_setUnmountHandler', () => {
    it('should call supplied componentWillUnmount in the correct context', () => {
      var cleanUpSpy = jasmine.createSpy('cleanUp');
      var listeners = mockListeners();
      var refs = mockRefs();
      var syncs = mockSyncs();
      var id = 1234;
      var context = {
        componentWillUnmount() {
          cleanUpSpy(this.value);
        },
        value: 10
      };
      utils._setUnmountHandler(context, id, refs, listeners, syncs);
      context.componentWillUnmount();
      expect(cleanUpSpy).toHaveBeenCalledWith(10);
    });

    it('should call ref.off 3 times when the component unmounts', () => {
      var cleanUpSpy = jasmine.createSpy('cleanUpOne');
      var mockRef = jasmine.createSpyObj('mockRef', ['on', 'off']);
      var listeners = mockListeners();
      var refs = mockRefs([[1234, mockRef], [2345, mockRef], [3456, mockRef]]);
      var syncs = mockSyncs();
      var ids = [1234, 2345, 3456];
      var context = {
        componentWillUnmount() {
          cleanUpSpy(this.value);
        },
        value: 10
      };
      utils._setUnmountHandler(context, ids[0], refs, listeners, syncs);
      utils._setUnmountHandler(context, ids[1], refs, listeners, syncs);
      utils._setUnmountHandler(context, ids[2], refs, listeners, syncs);
      context.componentWillUnmount();
      expect(cleanUpSpy.calls.count()).toEqual(1);
      expect(mockRef.off.calls.count()).toEqual(3);
    });

    it('should call listeners.delete 3 times when the component unmounts', () => {
      var mockRef = jasmine.createSpyObj('mockRef', ['on', 'off']);
      var listeners = mockListeners();
      spyOn(listeners, 'delete');
      var refs = mockRefs([[1234, mockRef], [2345, mockRef], [3456, mockRef]]);
      var syncs = mockSyncs();
      var ids = [1234, 2345, 3456];
      var context = {};
      utils._setUnmountHandler(context, ids[0], refs, listeners, syncs);
      utils._setUnmountHandler(context, ids[1], refs, listeners, syncs);
      utils._setUnmountHandler(context, ids[2], refs, listeners, syncs);
      context.componentWillUnmount();
      expect(listeners.delete.calls.count()).toEqual(3);
    });

    it('should remove syncs when the component unmounts', () => {
      var mockRef = jasmine.createSpyObj('mockRef', ['on', 'off']);
      var listeners = mockListeners();
      spyOn(listeners, 'delete');
      var refs = mockRefs([[1234, mockRef], [2345, mockRef], [3456, mockRef]]);
      var context = {};
      var syncs = mockSyncs([
        [
          context,
          [
            mockSync({ id: 1234, updateFirebase: () => {}, state: 'stateOne' }),
            mockSync({ id: 2345, updateFirebase: () => {}, state: 'stateTwo' }),
            mockSync({
              id: 3456,
              updateFirebase: () => {},
              state: 'stateThree'
            })
          ]
        ]
      ]);
      utils._setUnmountHandler(context, 1234, refs, listeners, syncs);
      utils._setUnmountHandler(context, 2345, refs, listeners, syncs);
      utils._setUnmountHandler(context, 3456, refs, listeners, syncs);
      context.componentWillUnmount();
      expect(syncs.get(context).length).toEqual(0);
    });
  });

  describe('_fsSetUnmountHandler', () => {
    it('should call supplied componentWillUnmount in the correct context', () => {
      var cleanUpSpy = jasmine.createSpy('cleanUp');
      var listeners = mockListeners();
      var refs = mockRefs();
      var syncs = mockSyncs();
      var id = 1234;
      var context = {
        componentWillUnmount() {
          cleanUpSpy(this.value);
        },
        value: 10
      };
      utils._fsSetUnmountHandler(context, id, refs, listeners, syncs);
      context.componentWillUnmount();
      expect(cleanUpSpy).toHaveBeenCalledWith(10);
    });

    it('should call listener unsubscribe 3 times when the component unmounts', () => {
      var cleanUpSpy = jasmine.createSpy('cleanUpOne');
      var unsubscribeSpy = jasmine.createSpy();
      var listeners = mockListeners([
        [1234, unsubscribeSpy],
        [2345, unsubscribeSpy],
        [3456, unsubscribeSpy]
      ]);
      var refs = mockRefs();
      var syncs = mockSyncs();
      var ids = [1234, 2345, 3456];
      var context = {
        componentWillUnmount() {
          cleanUpSpy(this.value);
        }
      };
      utils._fsSetUnmountHandler(context, ids[0], refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, ids[1], refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, ids[2], refs, listeners, syncs);
      context.componentWillUnmount();
      expect(cleanUpSpy.calls.count()).toEqual(1);
      expect(unsubscribeSpy.calls.count()).toEqual(3);
    });

    it('should call listeners.delete 3 times when the component unmounts', () => {
      var unsubscribeSpy = jasmine.createSpy();
      var mockedDoc = mockDoc(unsubscribeSpy);
      var listeners = mockListeners([
        [1234, unsubscribeSpy],
        [2345, unsubscribeSpy],
        [3456, unsubscribeSpy]
      ]);
      spyOn(listeners, 'delete');
      var refs = mockRefs([
        [1234, mockedDoc],
        [2345, mockedDoc],
        [3456, mockedDoc]
      ]);
      var syncs = mockSyncs();
      var ids = [1234, 2345, 3456];
      var context = {};
      utils._fsSetUnmountHandler(context, ids[0], refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, ids[1], refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, ids[2], refs, listeners, syncs);
      context.componentWillUnmount();
      expect(listeners.delete.calls.count()).toEqual(3);
    });

    it('should remove syncs when the component unmounts', () => {
      const unsubscribeSpy = jasmine.createSpy();
      var listeners = mockListeners([
        [1234, unsubscribeSpy],
        [2345, unsubscribeSpy],
        [3456, unsubscribeSpy]
      ]);
      var mockedDoc = mockDoc();
      var refs = mockRefs([
        [1234, mockedDoc],
        [2345, mockedDoc],
        [3456, mockedDoc]
      ]);
      var context = {};
      var syncs = mockSyncs([
        [
          context,
          [
            mockSync({ id: 1234, updateFirebase: () => {}, state: 'stateOne' }),
            mockSync({ id: 2345, updateFirebase: () => {}, state: 'stateTwo' }),
            mockSync({
              id: 3456,
              updateFirebase: () => {},
              state: 'stateThree'
            })
          ]
        ]
      ]);
      utils._fsSetUnmountHandler(context, 1234, refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, 2345, refs, listeners, syncs);
      utils._fsSetUnmountHandler(context, 3456, refs, listeners, syncs);
      context.componentWillUnmount();
      expect(syncs.get(context).length).toEqual(0);
    });
  });

  describe('_setData ', () => {
    it('should call ref.set with the supplied data', () => {
      var ref = mockRef();
      spyOn(ref, 'set');
      var data = {
        key: 'value'
      };
      var errorHandler = function errorHandler() {};
      utils._setData(ref, data, errorHandler);
      expect(ref.set).toHaveBeenCalledWith(data, errorHandler);
    });

    it('should modify data from array to object when keepKeys is true', () => {
      var ref = mockRef();
      spyOn(ref, 'set');
      var data = [{ key: '-1234', name: 'Chris', comments: [1, 2, 3, 4] }];
      var errorHandler = function errorHandler() {};
      var keepKeys = true;
      utils._setData(ref, data, errorHandler, keepKeys);
      expect(ref.set).toHaveBeenCalledWith(
        {
          ['-1234']: { key: '-1234', name: 'Chris', comments: [1, 2, 3, 4] }
        },
        errorHandler
      );
    });
  });

  describe('_updateSyncState', () => {
    it('should call ref.set with single value', () => {
      var ref = mockRef();
      spyOn(ref, 'set');
      var onFailure = () => {};
      var keepKeys = undefined;
      var data = 5;
      utils._updateSyncState(ref, onFailure, keepKeys, data);
      expect(ref.set.calls.argsFor(0)[0]).toEqual(5);
    });

    it('should call ref.set 3 times for an object with three child nodes', () => {
      var ref = mockRef();
      spyOn(ref, 'set');
      var onFailure = () => {};
      var keepKeys = undefined;
      var data = {
        key1: {
          value: 1,
          key2: {
            value: 2,
            key3: {
              value: 3
            }
          }
        }
      };
      utils._updateSyncState(ref, onFailure, keepKeys, data);
      expect(ref.set.calls.count()).toEqual(3);
    });

    it('should call ref.set 2 times for an object with 1 child node and timestamp', () => {
      var ref = mockRef();
      spyOn(ref, 'set');
      var onFailure = () => {};
      var keepKeys = undefined;
      var data = {
        key1: {
          value: 1,
          '.sv': 'timestamp'
        }
      };
      utils._updateSyncState(ref, onFailure, keepKeys, data);
      expect(ref.set.calls.count()).toEqual(2);
    });
  });

  describe('_addListener', () => {
    it('should add a listener for a given id', () => {
      var listeners = mockListeners();
      spyOn(listeners, 'set').and.callThrough();
      var id = 1234;
      var invoker = 'bindToState';
      var options = {
        context: {}
      };
      var ref = mockRef();
      utils._addListener(id, invoker, options, ref, listeners);
      expect(listeners.set.calls.count()).toEqual(1);
      expect(listeners.size).toEqual(1);
    });
  });

  describe('_addFirestoreListener', () => {
    it('should add a listener for a given id', () => {
      var listeners = mockListeners();
      spyOn(listeners, 'set').and.callThrough();
      var id = 1234;
      var invoker = 'bindToCollection';
      var options = {
        context: {}
      };
      var ref = mockCollection();
      utils._addFirestoreListener(id, invoker, options, ref, listeners);
      expect(listeners.set.calls.count()).toEqual(1);
      expect(listeners.size).toEqual(1);
    });
  });
});
