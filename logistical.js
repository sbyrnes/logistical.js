/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var Linear = require('sylvester');

/*
 * Main classifier entity.
 */
var Classifier = function() {};

/*
 * Intermediate funtion for calculating the likelihood
 */
Classifier.prototype.zi = function(W, Xi) {
  // Validate that we have the correct matrix parameters
  if ( !(W instanceof Linear.Vector) ) {
    throw new TypeError("W needs to be of type Vector");
  }

  if ( !(Xi instanceof Linear.Vector) ) {
    throw new TypeError("Xi needs to be of type Matrix");
  }

  // validate that both vectors have the same number of elements
  var NW = W.elements.length;
  var NXi = Xi.elements.length;

  if ( NW == NXi ) {
    N = NW;
  } else {
    throw new Error('Vectors must have the same number of elements');
  }

  var k = 1, sum = 0;

  for (k=1; k<=N; k++) {
    sum += W.e(k) * Xi.e(k);
  }

  return sum;
};

/* Computes the logistic function value for a given input. */
Classifier.prototype.logistic = function(z) {
  return 1.0 / (1.0 + Math.exp(-z));
};

/* Trains the classifier on a given training example. */
Classifier.prototype.train = function(expectedValue, data) {
};

/* Classifies the provided example. */
Classifier.prototype.classify = function(data) {
  return 1;
};

module.exports = Classifier;
