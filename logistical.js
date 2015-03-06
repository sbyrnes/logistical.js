/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var LinearValidator = require('./lib/linear_support.js');

/*
 * Main classifier entity.
 */
var Classifier = function() { };

/*
 * Intermediate function for calculating the partial sum for the likelihood
 *
 * w = vector coefficients with k elements
 * Xi = vector of training data with k elements
 */
Classifier.prototype.ZiPartialSum = function(w, Xi) {
  LinearValidator.isVector(w, Xi);
  LinearValidator.hasEqualElementCount(w, Xi);

  var sum = w.dot(Xi);

  // Need to try this as "failure" is a null return.  The challenge here is
  // that this doesn't halp the caller.
  if ( sum === null ) throw new Error('Unable to compute the dot product');

  return sum;
};

/*
 * Compute the likelihood for a set of coefficients, data and labels
 *
 * w = Vector coefficients
 * Y = array of labels for the data (Y1, Y2, ..., Yn)
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 */
Classifier.prototype.likelihood = function(w, Y, X) {
  LinearValidator.isVector(w);
  LinearValidator.isArray(Y);
  LinearValidator.isMatrix(X);

  // Ensure the partial sum will not throw an error
  LinearValidator.hasEqualElementCount(w, X.row(1));

  var N = Y.length;

  var sum = 0;

  for (var i = 0; i < N; i++) {
    sum += Math.log( this.logistic(Y[i] * this.ZiPartialSum(w, X.row(i+1))) );
  }

  return sum;
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
