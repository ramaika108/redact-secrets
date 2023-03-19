'use strict'

var traverse = require('traverse')
var isSecret = require('is-secret')

module.exports = function (redacted) {
  return {
    map: map,
    forEach: forEach
  }

  function map (obj) {
      try{
        return traverse(obj).map(function (val) {
            if (this.level >= 8) return
            else if (isSecret.key(this.key) || isSecret.value(val)) this.update(redacted)
        })
      } catch(err) {
          return obj
      }
  }

  function forEach (obj) {
      try{
        traverse(obj).forEach(function (val) {
            if (this.level >= 8) return
            else if (isSecret.key(this.key) || isSecret.value(val)) this.update(redacted)
        })
      } catch(err) {
        return
      }
  }
}
