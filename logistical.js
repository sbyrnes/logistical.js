/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var LinearValidator = require('./lib/linear_support.js');
var Sylvester = require("sylvester");

// Learning parameters
var DESCENT_STEPS = 5000; // number of iterations to execute gradient descent
var ALPHA = 0.0005;       // learning rate, should be small
var BETA = 0.0007;        // regularization factor, should be small
var MAX_ERROR = 0.0005;	  // threshold which, if reached, will stop descent automatically

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
 * Randomly generates a vector of coefficients of the specified size.
 */
Classifier.prototype.generateRandomCoefficients = function(size) {
  if(size < 1) return null;

  return Sylvester.Vector.Random(size);
}

/*
 * Calculates the error of the provided model as applied to the input data and expected outcomes.
 */
Classifier.prototype.calculateError = function(w, Y_exp, X) {
  var error = 0.0;

  return error;
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
