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
 */

var VectorTypeAsString = 'Vector';
var MatrixTypeAsString = 'Matrix';
var ArrayTypeAsString = 'Array';

/*
 * helper method to reduce duplication for validating data types
 *
 * obj - The object we want to test the type of
 * type - The expected type
 * msg - Additional message to include on error
 */
function isObjectAtIndex(obj, type, msg) {
  var errorMessage = "Argument needs to be of type " + type + ".  " + msg;

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

/*
 * helper method to construct the message indicating the index of the failed object type test
 */
function indexMessage (index) {
  return "Failed at index position: " + index.toString();
}

/*
 * Validate whether each argument is of type Vector
 */
module.exports.isVector = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    isObjectAtIndex(arguments[i], VectorTypeAsString, indexMessage(i));
  }
};

/*
 * Validate whether each argument is of type Matrix
 */
module.exports.isMatrix = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    isObjectAtIndex(arguments[i], MatrixTypeAsString, indexMessage(i));
  }
};

/*
 * Validate whether each argument is of type Array
 */
module.exports.isArray = function() {
  for ( var i = 0; i < arguments.length; i++ ) {
    isObjectAtIndex(arguments[i], ArrayTypeAsString, indexMessage(i));
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
