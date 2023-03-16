'use strict'

var _ = require('lodash');
var isSecret = require('is-secret');
const { walk } = require('@whi/object-walk');

module.exports = function (redacted) {
  return {
    map: map,
    forEach: forEach
  }

  function map (obj) {
    let newObj = {};
    walk( obj, function ( key, val, path ) {

        if (path.length >= 8) {
            _.set(newObj, path, val);
            return val;
        }

        try{
            if (isSecret.key(key) || isSecret.value(val)) {
                newObj[path[0]] = _.cloneDeep(newObj[path[0]]);
                _.set(newObj, path, redacted);
            }
            else _.set(newObj, path, val);
        } catch(err) {
            _.set(newObj, path, val);
        }
        return val;
    });
    return newObj;
  }

  function forEach (obj) {
    walk( obj, function ( key, val ) {
        try{
            if (isSecret.key(key) || isSecret.value(val)) return redacted;
        } catch(err) {
            return val;
        }
        return val;
    });
  }
}

