var Linear = require('Sylvester');

/*
 * support.js
 *
 * Support library for the logistical regression package
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var VectorTypeAsString = 'Vector';
var MatrixTypeAsString = 'Matrix';
var ArrayTypeAsString = 'Array';

/*
 * Returns true if the specified object is of the specified type.
 *
 * obj  - The object to test
 * type - The expected type
 */
function isObject(obj, type) {
  switch (type) {
    case VectorTypeAsString:
    case MatrixTypeAsString:
      return (obj instanceof Linear[type] );
    case ArrayTypeAsString:
      return (obj instanceof Array );
    default:
      return false;
  }
}

/*
 * Asserts that all specified objects are of the specified type.
 *
 * objects - An array of objects we want to test the type of
 * type - The expected type
 */
function assertObject(objects, type) {
  var obj;

  for ( var i = 0; i < objects.length; i++ ) {
    obj = objects[i];

    if(!isObject(obj, type)) {
      var errorMessage = "Argument needs to be of type " + type + ".  Failed at index position: " + i;
      throw TypeError(errorMessage);
    }
  }
}

/*
 * True if a vector is provided
 */
module.exports.isVector = function(object) {
  return isObject(object, VectorTypeAsString);
};

/*
 * Validate whether each argument is of type Vector
 */
module.exports.assertVector = function() {
  assertObject(arguments, VectorTypeAsString);
};

/*
 * True is the input is a matrix
 */
module.exports.isMatrix = function(object) {
  return isObject(object, MatrixTypeAsString);
};

/*
 * Validate whether each argument is of type Matrix
 */
module.exports.assertMatrix = function() {
  assertObject(arguments, MatrixTypeAsString);
};

/*
 * True if the input is an array
 */
module.exports.isArray = function(object) {
  return isObject(object, ArrayTypeAsString);
};

/*
 * Validate whether each argument is of type Array
 */
module.exports.assertArray = function() {
  assertObject(arguments, ArrayTypeAsString);
};

/*
 * Validate whether all of the Vector arguments have the same number
 * of elements in their space
 */
module.exports.assertEqualElementCount = function() {
  var N = arguments[0].elements.length;

  for ( var i = 0; i < arguments.length; i++) {
    if ( N != arguments[i].elements.length ) {
      throw new Error('Error: Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }
};

/*
 * Validate whether all of the Matrix arguments have the same dimensions
 */
module.exports.assertEqualDimensions = function() {
  var dim = [arguments[0].rows(), arguments[0].cols()];

  for ( var i = 0; i < arguments.length; i++) {
    var rows = arguments[i].rows();
    var cols = arguments[i].cols();

    if (( rows != dim[0] ) && ( cols != dim[1] )) {
      throw new Error('Error: Vectors must have the same number of elements. Failed at index ' + i.toString());
    }
  }
};

module.exports.isNumeric = function(input) {
  return /^[+|-]?(\d|\.)+$/.test(input);
};

module.exports.assertNumeric = function() {
  for ( var i = 0; i < arguments.length; i++) {
    if ( !this.isNumeric(arguments[i]) ) {
      throw new Error('Error: elements must be numeric. Failed at index ' + i.toString());
    }
  }
};

module.exports.isNull = function(input) {
  return (input == null);
};

module.exports.assertNull = function() {
  for ( var i = 0; i < arguments.length; i++) {
    if ( this.isNull(arguments[i]) ) {
      throw new Error('Error: Null elements present. Failed at index ' + i.toString());
    }
  }
};

/*
 * Validate whether the given input is empty
 */
module.exports.isEmpty = function(input) {
  var result = true;

  if(this.isVector(input)) {
    if (input.cols() > 0) result = false;
  } else if (this.isMatrix(input)) {
    if (input.cols() > 1 && input.rows() > 1) result = false;
  } else if (this.isArray(input)) {
    if (input.length > 0) result = false;
  }

  return result;
};

module.exports.assertEmpty = function() {
  for ( var i = 0; i < arguments.length; i++) {
    if ( this.isEmpty(arguments[i]) ) {
      throw new Error('Error: Empty elements present. Failed at index ' + i.toString());
    }
  }
};

/*
 * Validates whether the dimensions of two inputs match.
 */
module.exports.isMatching = function(first, second) {
  var result = false;

  if(this.isVector(first) && this.isVector(second)) {
    result = first.cols() == second.cols();
  } else if(this.isVector(first) && this.isMatrix(second)) {
    result = first.cols() == second.rows();
  }

  return result;
};
