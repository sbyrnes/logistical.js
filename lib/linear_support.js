var Linear = require('Sylvester');

/*
 * linear_support.js
 * Support library for the logistical regression package
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 *
 */

var VectorTypeAsString = 'Vector';
var MatrixTypeAsString = 'Matrix';
var ArrayTypeAsString = 'Array';

/*
 * helper method to reduce duplication for validating data types
 *
 * objects - An array of objects we want to test the type of
 * type - The expected type
 */
function isObject(objects, type) {
  var obj, errorMessage;

  for ( var i = 0; i < objects.length; i++ ) {
    obj = objects[i];
    errorMessage = "Argument needs to be of type " + type + ".  Failed at index position: " + i;

    switch (type) {
      case VectorTypeAsString:
      case MatrixTypeAsString:
        if ( !(obj instanceof Linear[type] ) ) throw new TypeError(errorMessage);
        break;
      case ArrayTypeAsString:
        if ( !(obj instanceof Array ) ) throw new TypeError(errorMessage);
        break;
      default:
        throw new Error('Undefined Object type being tested: ' + type);
    }
  }
}

/*
 * Validate whether each argument is of type Vector
 */
module.exports.isVector = function() {
  isObject(arguments, VectorTypeAsString);
};

/*
 * Validate whether each argument is of type Matrix
 */
module.exports.isMatrix = function() {
  isObject(arguments, MatrixTypeAsString);
};

/*
 * Validate whether each argument is of type Array
 */
module.exports.isArray = function() {
  isObject(arguments, ArrayTypeAsString);
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

/*
 * Validate whether all of the Matrix arguments have the same dimensions
 */
module.exports.isNotZeroSized = function() {
