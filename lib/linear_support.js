var Linear = require('sylvester');

/*
 * linear_support.js
 * Support library for the logistical regression package
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 *
 * Validate whether each argument is of type Vector
 */
module.exports.isVector = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Linear.Vector) ) {
      throw new TypeError("Argument needs to be of type Vector.  Failed at index " + i.toString());
    }
  }
};

/*
 * Validate whether each argument is of type Matrix
 */
module.exports.isMatrix = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Linear.Matrix) ) {
      throw new TypeError("Argument needs to be of type Matrix.  Failed at index " + i.toString());
    }
  }
};

/*
 * Validate whether each argument is of type Array
 */
module.exports.isArray = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    if ( !(arguments[i] instanceof Array) ) {
      throw new TypeError("Argument needs to be of type Array.  Failed at index " + i.toString());
    }
  }
};

/*
 * Validate whether all of the Vector arguments have the same number
 * of elements in their space
 */
module.exports.hasEqualElementCount = function() {
  var N = arguments[0].elements.length;

  for ( var i = 0; i < arguments.length; i++) {
    if ( N != arguments[i].elements.length ) {
      throw new Error('Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }
};

/*
 * Validate whether all of the Matrix arguments have the same dimensions
 */
module.exports.hasEqualDimensions = function() {
  var dim = [arguments[0].rows(), arguments[0].cols()];

  for ( var i = 0; i < arguments.length; i++) {
    var rows = arguments[i].rows();
    var cols = arguments[i].cols();

    if (( rows != dim[0] ) && ( cols != dim[1] )) {
      throw new Error('Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }
};
