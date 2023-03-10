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
        try{
            if (isSecret.key(key) || isSecret.value(val)) _.set(newObj, path, redacted);
            else if(typeof val !== 'object') _.set(newObj, path, val);
        } catch(err) {
            _.set(newObj, path, val);
        }
        return val;
    });
    return newObj;
  }

  function forEach (obj) {
    walk( obj, function ( key, val ) {
        if (isSecret.key(key) || isSecret.value(val)) return redacted;
        return val;
    });
  }
}

