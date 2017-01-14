import {
  _isObject,
  _throwError
} from './utils';

const optionValidators = {
  notObject(options){
    if(!_isObject(options)){
      _throwError(`The options argument must be an object. Instead, got ${options}`, 'INVALID_OPTIONS');
    }
  },
  context(options){
    this.notObject(options);
    if(!options.context || !_isObject(options.context)){
      this.makeError('context', 'object', options.context);
    }
  },
  state(options){
    this.notObject(options);
    if(!options.state || typeof options.state !== 'string'){
      this.makeError('state', 'string', options.state);
    }
  },
  then(options){
    this.notObject(options);
    if(typeof options.then === 'undefined' || typeof options.then !== 'function'){
      this.makeError('then', 'function', options.then);
    }
  },
  data(options){
    this.notObject(options);
    if(typeof options.data === 'undefined'){
      this.makeError('data', 'ANY', options.data);
    }
  },
  query(options){
    this.notObject(options);
    var validQueries = ['limitToFirst', 'limitToLast', 'orderByChild', 'orderByValue', 'orderByKey', 'orderByPriority', 'startAt', 'endAt', 'equalTo'];
    var queries = options.queries;
    for(var key in queries){
      if(queries.hasOwnProperty(key) && validQueries.indexOf(key) === -1){
        _throwError(`The query field must contain valid Firebase queries.  Expected one of [${validQueries.join(', ')}]. Instead, got ${key}`, 'INVALID_OPTIONS');
      }
    }
  },
  asString(options){
    this.notObject(options);
    if(options.asString === true && (options.isNullable === true || options.asArray === true)) {
      _throwError(`The asString option must not be used in conjuntion with the options isNullable or asArray`, 'INVALID_OPTIONS');
    }
  },
  makeError(prop, type, actual){
    _throwError(`The options argument must contain a ${prop} property of type ${type}. Instead, got ${actual}`, 'INVALID_OPTIONS');
  }
};

const _validateEndpoint = function(endpoint){
  var defaultError = 'The Firebase endpoint you are trying to listen to';
  var errorMsg;
  if(typeof endpoint !== 'string'){
    errorMsg = `${defaultError} must be a string. Instead, got ${endpoint}`;
  } else if(endpoint.length === 0){
    errorMsg = `${defaultError} must be a non-empty string. Instead, got ${endpoint}`;
  } else if(endpoint.length > 768){
    errorMsg = `${defaultError} is too long to be stored in Firebase. It must be less than 768 characters.`;
  } else if(/^$|[\[\]\#\$]|.{1}[\.]/.test(endpoint)){
    errorMsg = `${defaultError} in invalid. Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]".`;
  }

  if(typeof errorMsg !== 'undefined'){
    _throwError(errorMsg, "INVALID_ENDPOINT");
  }
};

const _validateDatabase = function(db) {
  var defaultError = 'Rebase.createClass failed.';
  var errorMsg;
  if(typeof db !== 'object' || !db.app){
    errorMsg = `${defaultError} Expected an initialized firebase database object.`;
  } else if(!db || arguments.length > 1){
    errorMsg = `${defaultError} expects 1 argument.`;
  }

  if(typeof errorMsg !== 'undefined'){
    _throwError(errorMsg, "INVALID_CONFIG");
  }
};

export {
  optionValidators,
  _validateDatabase,
  _validateEndpoint
}
