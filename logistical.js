/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var LinearValidator = require('./lib/linear_support.js');
var Linear = require('sylvester');

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

  // play nice with the caller because null is technically a "failure"
  if ( sum === null ) throw new Error('Unable to compute the dot product');

  return sum;
};

/*
 * Compute the log likelihood for a set of coefficients, data and labels
 *
 * w = Vector coefficients
 * Y = array of labels for the data (Y1, Y2, ..., Yn)
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 * C = Regularization constant
 */
Classifier.prototype.logLikelihood = function(w, Y, X, C) {
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

  // Account for regularization
  if ( C > 0 ) {
    sum = -sum + 0.5 * C * w.dot(w);
  }

  return sum;
};

/*
 * Compute the gradient of the log likelihood
 *
 * Returns a vector of gradients with respect to the coefficients
 *
 */

Classifier.prototype.loglikelihoodGradient = function(w, X, Y, C) {
  LinearValidator.isVector(w);
  LinearValidator.isArray(Y);
  LinearValidator.isMatrix(X);

  // Ensure the partial sum will not throw an error
  LinearValidator.hasEqualElementCount(w, X.row(1));

  var N = Y.length;
  var K = w.cols();

  var partialL = [];

  for (var k = 0; k < K; k++) {
    for (var i = 0; i < N; i++) {
      partialL[k] += Y[i] * X.e(i+1, k) * this.logistic(-Y[i] * this.ZiPartialSum(w, X.row(i+1)));

      // Account for regularization
      if ( C > 0 ) {
        partialL[k] += 0;
      }
    }
  }

  return Linear.Vector.create(partialL);
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
