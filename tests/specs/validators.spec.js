describe('Validators', () => {
  const {
    optionValidators,
    _validateEndpoint,
    _validateDatabase,
    _validateCollectionPath,
    _validateDocumentPath
  } = require('../../src/lib/validators');
  const invalidEndpoints = require('../fixtures/invalidEndpoints');

  describe('optionValidators', () => {
    describe('notObject()', () => {
      it('should throw on non object', () => {
        expect(() => {
          optionValidators.notObject('string');
        }).toThrow();
      });

      it('should not throw on an object', () => {
        expect(() => {
          optionValidators.notObject({});
        }).not.toThrow();
      });
    });

    describe('context()', () => {
      it('should throw if nothing is passed', () => {
        expect(() => {
          optionValidators.context();
        }).toThrow();
      });

      it('should throw if non object is passed', () => {
        expect(() => {
          optionValidators.context('string');
        }).toThrow();
      });

      it('should throw if object passed does not have a context property', () => {
        expect(() => {
          optionValidators.context({ key: 'value' });
        }).toThrow();
      });

      it('should throw if context property is not an object', () => {
        expect(() => {
          optionValidators.context({ context: 'string' });
        }).toThrow();
      });

      it('should not throw if context property is valid', () => {
        expect(() => {
          optionValidators.context({ context: {} });
        }).not.toThrow();
      });
    });

    describe('state()', () => {
      it('should throw if no state property is present', () => {
        expect(() => {
          optionValidators.state({ context: {} });
        }).toThrow();
      });

      it('should throw if no state property is not a string', () => {
        expect(() => {
          optionValidators.state({ state: {} });
        }).toThrow();
      });

      it('should not throw if state property is valid', () => {
        expect(() => {
          optionValidators.state({ state: 'foo.bar.baz' });
        }).not.toThrow();
        expect(() => {
          optionValidators.state({ state: 'foo' });
        }).not.toThrow();
      });
    });

    describe('then()', () => {
      it('should throw if then property is not present', () => {
        expect(() => {
          optionValidators.then({ state: 'foo.bar.baz' });
        }).toThrow();
      });

      it('should throw if then property is not a function', () => {
        expect(() => {
          optionValidators.then({ then: 'foo.bar.baz' });
        }).toThrow();
      });

      it('should not throw if then property is valid', () => {
        expect(() => {
          optionValidators.then({ then: () => {} });
        }).not.toThrow();
      });
    });

    describe('data()', () => {
      it('should throw if data property is not present', () => {
        expect(() => {
          optionValidators.data({ state: 'value' });
        }).toThrow();
      });

      it('should throw if data property is undefined', () => {
        expect(() => {
          optionValidators.data({ data: undefined });
        }).toThrow();
      });

      it('should not throw if data property is null', () => {
        expect(() => {
          optionValidators.data({ data: null });
        }).not.toThrow();
      });

      it('should not throw if data property is have any value', () => {
        expect(() => {
          optionValidators.data({ data: 5 });
        }).not.toThrow();
        expect(() => {
          optionValidators.data({ data: {} });
        }).not.toThrow();
        expect(() => {
          optionValidators.data({ data: 'string' });
        }).not.toThrow();
      });
    });

    describe('query()', () => {
      it('should throw if invalid query is passed', () => {
        expect(() => {
          optionValidators.query({
            queries: {
              notValid: 10
            }
          });
        }).toThrow();
      });

      it('should not throw if valid query is passed', () => {
        expect(() => {
          optionValidators.query({
            queries: {
              limitToFirst: 10,
              limitToLast: 5,
              orderByChild: 'child',
              orderByValue: 'value',
              orderByKey: 'key',
              orderByPriority: '?',
              startAt: 1,
              endAt: 10
            }
          });
        }).not.toThrow();
      });
    });

    describe('defaultValue', () => {
      it('should throw if defaultValue is not valid', () => {
        expect(() => {
          optionValidators.defaultValue({
            defaultValue: undefined
          });
        }).toThrow();
      });

      it('should not throw if defaultValue is valid', () => {
        expect(() => {
          optionValidators.defaultValue({
            defaultValue: {}
          });
          optionValidators.defaultValue({
            defaultValue: ''
          });
          optionValidators.defaultValue({
            defaultValue: null
          });
          optionValidators.defaultValue({
            defaultValue: 5
          });
          optionValidators.defaultValue({
            defaultValue: []
          });
        }).not.toThrow();
      });
    });

    describe('makeError()', () => {
      it('should throw an error with the passed data', () => {
        expect(() => {
          optionValidators.makeError('Prop', 'Type', 'Actual');
        }).toThrowError(
          'REBASE: The options argument must contain a Prop property of type Type. Instead, got Actual'
        );
      });
    });
  });

  describe('_validateEndpoint()', () => {
    it('should throw if endpoint is not a string', () => {
      expect(() => {
        _validateEndpoint(null);
      }).toThrow();
    });
    it('should throw if endpoint is empty string', () => {
      expect(() => {
        _validateEndpoint('');
      }).toThrow();
    });
    it('should throw if endpoint is too long', () => {
      var endpoint = new Array(770).join('a');
      expect(() => {
        _validateEndpoint(endpoint);
      }).toThrow();
    });
    it('should throw if endpoint contains invalid characters', () => {
      invalidEndpoints.forEach(endpoint => {
        expect(() => {
          _validateEndpoint(endpoint);
        }).toThrow();
      });
    });
  });

  describe('_validateDatabase()', () => {
    it('should throw if argument is empty', () => {
      expect(() => {
        _validateDatabase();
      }).toThrow();
    });
    it('should throw if there argument does not have an app property', () => {
      expect(() => {
        _validateDatabase({ other: 'value' });
      }).toThrow();
    });

    it('should not throw if argument is valid RTDB object', () => {
      expect(() => {
        _validateDatabase({ ref: () => {} });
      }).not.toThrow();
    });

    it('should not throw if argument is valid Firestore DB object', () => {
      expect(() => {
        _validateDatabase({ collection: () => {} });
      }).not.toThrow();
    });
  });

  describe('_validateDocumentPath', () => {
    it('should throw if path does not have an even number of segments', () => {
      expect(() => {
        _validateDocumentPath('collectionName');
      }).toThrow();
    });
    it('should not throw if argument is valid', () => {
      expect(() => {
        _validateDocumentPath('collectionName/document');
      }).not.toThrow();
    });
    it('should not throw if argument is valid with leading slash', () => {
      expect(() => {
        _validateDocumentPath('/collectionName/document');
      }).not.toThrow();
    });
  });

  describe('_validateCollectionPath', () => {
    it('should throw if path does not have an odd number of segments', () => {
      expect(() => {
        _validateCollectionPath('collectionName/document');
      }).toThrow();
    });
    it('should not throw if argument is valid', () => {
      expect(() => {
        _validateCollectionPath('collectionName');
      }).not.toThrow();
    });
    it('should not throw if argument is valid', () => {
      expect(() => {
        _validateCollectionPath('collectionName/document/subCollection');
      }).not.toThrow();
    });
    it('should not throw if argument is valid with leading slash', () => {
      expect(() => {
        _validateCollectionPath('/collectionName/document/subCollection');
      }).not.toThrow();
    });
  });
});
