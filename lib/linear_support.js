var Linear = require('sylvester');

/*
 * linear_support.js
 * Support library for the logistical regression package
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */
var LinearSupport = function() {};

/*
 * Validate whether each argument is of type Vector
 */
LinearSupport.prototype.isVector = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Linear.Vector) ) {
      throw new TypeError("Argument needs to be of type Vector");
    }
  }
};

/*
 * Validate whether each argument is of type Matrix
 */
LinearSupport.prototype.isMatrix = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Linear.Matrix) ) {
      throw new TypeError("Argument needs to be of type Matrix");
    }
  }
};

/*
 * Validate whether all of the Vector arguments have the same number
 * of elements in their space
 */
LinearSupport.prototype.hasEqualElementCount = function() {
  var N = arguments[0].elements.length;

  for ( var i = 0; i < arguments.length; i++) {
    if ( N != arguments[i].elements.length ) {
      throw new Error('Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }
};

module.exports = LinearSupport;
