import { _isObject, _isValid, _throwError, _getSegmentCount } from './utils';

const optionValidators = {
  notObject(options) {
    if (!_isObject(options)) {
      _throwError(
        `The options argument must be an object. Instead, got ${options}`,
        'INVALID_OPTIONS'
      );
    }
  },
  context(options) {
    this.notObject(options);
    if (!options.context || !_isObject(options.context)) {
      this.makeError('context', 'object', options.context);
    }
  },
  state(options) {
    this.notObject(options);
    if (!options.state || typeof options.state !== 'string') {
      this.makeError('state', 'string', options.state);
    }
  },
  then(options) {
    this.notObject(options);
    if (
      typeof options.then === 'undefined' ||
      typeof options.then !== 'function'
    ) {
      this.makeError('then', 'function', options.then);
    }
  },
  data(options) {
    this.notObject(options);
    if (typeof options.data === 'undefined') {
      this.makeError('data', 'ANY', options.data);
    }
  },
  query(options) {
    this.notObject(options);
    var validQueries = [
      'limitToFirst',
      'limitToLast',
      'orderByChild',
      'orderByValue',
      'orderByKey',
      'orderByPriority',
      'startAt',
      'endAt',
      'equalTo'
    ];
    var queries = options.queries;
    for (var key in queries) {
      if (queries.hasOwnProperty(key) && validQueries.indexOf(key) === -1) {
        _throwError(
          `The query field must contain valid Firebase queries.  Expected one of [${validQueries.join(
            ', '
          )}]. Instead, got ${key}`,
          'INVALID_OPTIONS'
        );
      }
    }
  },
  defaultValue(options) {
    this.notObject(options);
    if (options.hasOwnProperty('defaultValue')) {
      if (!_isValid(options.defaultValue)) {
        _throwError(
          `The typeof defaultValue must be one of string, number, boolean, object.`,
          'INVALID_OPTIONS'
        );
      }
    }
  },
  makeError(prop, type, actual) {
    _throwError(
      `The options argument must contain a ${prop} property of type ${type}. Instead, got ${actual}`,
      'INVALID_OPTIONS'
    );
  }
};

const _validateEndpoint = function(endpoint) {
  if (typeof endpoint === 'object') {
    if (endpoint.hasOwnProperty('firestore')) {
      return;
    }
  }
  var defaultError = 'The Firebase endpoint you are trying to listen to';
  var errorMsg;
  if (typeof endpoint !== 'string') {
    errorMsg = `${defaultError} must be a string. Instead, got ${endpoint}`;
  } else if (endpoint.length === 0) {
    errorMsg = `${defaultError} must be a non-empty string. Instead, got ${endpoint}`;
  } else if (endpoint.length > 768) {
    errorMsg = `${defaultError} is too long to be stored in Firebase. It must be less than 768 characters.`;
  } else if (/^$|[\[\]\#\$]|.{1}[\.]/.test(endpoint)) {
    errorMsg = `${defaultError} in invalid. Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]".`;
  }

  if (typeof errorMsg !== 'undefined') {
    _throwError(errorMsg, 'INVALID_ENDPOINT');
  }
};

const _validateDatabase = function(db) {
  var defaultError = 'Rebase.createClass failed.';
  var errorMsg;
  if (typeof db !== 'object' || (!db.ref && !db.collection)) {
    errorMsg = `${defaultError} Expected an initialized firebase or firestore database object.`;
  }
  if (typeof errorMsg !== 'undefined') {
    _throwError(errorMsg, 'INVALID_CONFIG');
  }
};

const _validateDocumentPath = function(path) {
  if (typeof path === 'object' && path.hasOwnProperty('firestore')) return;
  var defaultError = 'Invalid document path or reference.';
  if (typeof path !== 'string') _throwError(defaultError, 'INVALID_ENDPOINT');
  const segmentCount = _getSegmentCount(path);
  if (segmentCount % 2 !== 0) _throwError(defaultError, 'INVALID_ENDPOINT');
};

const _validateCollectionPath = function(path) {
  if (typeof path === 'object' && path.hasOwnProperty('firestore')) return;
  var defaultError = 'Invalid collection path or reference.';
  if (typeof path !== 'string') _throwError(defaultError, 'INVALID_ENDPOINT');
  const segmentCount = _getSegmentCount(path);
  if (segmentCount % 2 === 0) _throwError(defaultError, 'INVALID_ENDPOINT');
};

export {
  optionValidators,
  _validateDatabase,
  _validateEndpoint,
  _validateDocumentPath,
  _validateCollectionPath
};
