/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var LinearAlgebra = require('sylvester');

/*
 * Main classifier entity.
 */
var Classifier = function() {};

/*
 * Intermediate funtion for calculating the likelihood
 */
Classifier.prototype.zi = function(Wk, Xik) {
  // Validate that we have matrix parameters
  if ( !(Xk instanceof LinearAlgebra.Vector) ) {
    throw new TypeError("Wk needs to be of type Vector");
  }

  if ( !(Xik instanceof LinearAlgebra.Matrix) ) {
    throw new TypeError("Xik needs to be of type Matrix");
  }
};

/* Computes the logistic function value for a given input. */
Classifier.prototype.logistic = function(z) {
  return 1.0 / (1.0 + math.exp(-z));
};

/* Trains the classifier on a given training example. */
Classifier.prototype.train = function(expectedValue, data) {
};

/* Classifies the provided example. */
Classifier.prototype.classify = function(data) {
  return 1;
};

module.exports = Classifier;
