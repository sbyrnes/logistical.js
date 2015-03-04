/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var Validator = require('./lib/linear_support.js');

/*
 * Main classifier entity.
 */
var Classifier = function() {};

/*
 * Intermediate function for calculating the partial sum for the likelihood
 */
Classifier.prototype.ZiPartialSum = function(W, Xi) {
  var validator = new Validator();

  validator.isVector(W, Xi);

  var N = validator.hasEqualElementCount(W, Xi);

  var sum = 0;

  for ( var k = 1; k <= N; k++) {
    sum += W.e(k) * Xi.e(k);
  }

  return sum;
};

/*
 * Compute the likelihood for a set of coefficients, data and labels
 */
Classifier.prototype.likelihood = function(W, Yi, Xi) {
  var val = new Validator();

  val.isVector(W, Yi, Xi);

  var N = validator.hasEqualElementCount(W, Yi, Xi);
};

/*
 * Computes the logistic function value for a given input.
 */
Classifier.prototype.logistic = function(z) {
  return 1.0 / (1.0 + Math.exp(-z));
};

/*
 * Trains the classifier on a given training example.
 */
Classifier.prototype.train = function(expectedValue, data) {
};

/*
 * Classifies the provided example.
 */
Classifier.prototype.classify = function(data) {
  return 1;
};

module.exports = Classifier;
