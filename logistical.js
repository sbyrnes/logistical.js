/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var Support = require('./lib/support.js');
var Linear = require('Sylvester');

// Learning parameters
var DESCENT_STEPS = 5000; // number of iterations to execute gradient descent
var ALPHA = 0.0005;       // learning rate, should be small
var BETA = 0.0007;        // regularization factor, should be small
var MAX_ERROR = 0.0005;	  // threshold which, if reached, will stop descent automatically

/*
 * Main classifier entity.
 */
var Classifier = function() {
  this.coefficientModel = [];
};

/*
 * Intermediate function for calculating the partial sum for the likelihood
 *
 * w = vector coefficients with k elements
 * Xi = vector of training data with k elements
 */
Classifier.prototype.ZiPartialSum = function(w, Xi) {
  Support.assertNull(w, Xi);
  Support.assertVector(w, Xi);
  Support.assertEqualElementCount(w, Xi);

  var dotProduct = w.dot(Xi);

  // play nice with the caller because null is technically a "failure"
  Support.assertNull(dotProduct);

  return dotProduct;
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
  Support.assertVector(w);
  Support.assertVector(Y);
  Support.assertMatrix(X);

  // Ensure the partial sum will not throw an error
  Support.assertEqualElementCount(w, X.row(1));

  var N = Y.cols();

  var sum = 0;

  for (var i = 1; i <= N; i++) {
    sum += Math.log( this.logistic(Y.e(i) * this.ZiPartialSum(w, X.row(i))) );
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
 * w = Vector coefficients
 * Y = array of labels for the data (Y1, Y2, ..., Yn)
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 * C = Regularization constant
 *
 * Returns a vector of gradients with respect to the coefficients
 */
Classifier.prototype.loglikelihoodGradient = function(w, X, Y, C) {
  Support.assertVector(w);
  Support.assertVector(Y);
  Support.assertMatrix(X);

  // Ensure the partial sum will not throw an error
  Support.assertEqualElementCount(w, X.row(1));

  var K = w.cols();
  var N = Y.cols();

  var partialLatW = [];

  for (var k = 0; k < K; k++) {
    var sum = 0.0;

    for (var i = 1; i <= N; i++) {
      sum += Y.e(i) * X.e(i, k+1) * this.logistic(-Y.e(i) * this.ZiPartialSum(w, X.row(i)));
    }

    // Account for regularization
    if ( C > 0 ) {
      sum = -sum + C * w.e(k+1);
    }

    partialLatW[k] = sum;
  }

  return Linear.Vector.create(partialLatW);
};

/*
 * Randomly generates a vector of coefficients of the specified size.
 */
Classifier.prototype.generateRandomCoefficients = function(size) {
  if(size < 1)
    throw Error("Error: size must be at least one");

  return Linear.Vector.Random(size);
};

/*
 * Calculates the error of the provided model as applied to the input data and expected outcomes.
 *
 * w = Vector coefficients
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 * Y_exp = array of labels for the data (Y1, Y2, ..., Yn)
 */
Classifier.prototype.calculateError = function(w, X, Y_exp) {
  Support.assertNull(X, Y_exp);
  Support.assertEmpty(X, Y_exp);
  Support.assertVector(w, Y_exp);
  Support.assertMatrix(X);

  if (!Support.isMatching(Y_exp, X))
    throw new Error("Error: mismatching input dimensions");

  // classify each and compare
  var errorCount = 0;

  for (var row = 1; row <= X.rows(); row++) {
    var Y_calc = this.classify(w, X.row(row));

    if (Y_calc != Y_exp.e(row)) {
      errorCount++;
    }
  }

  // Error is the percentage of misclassifications
  var error = errorCount / X.rows();

  return error;
};

/*
 * Computes the logistic function value for a given input.
 *
 * z - Numeric value to compute function on
 */
Classifier.prototype.logistic = function(z) {
  Support.assertNumeric(z);

  return 1.0 / (1.0 + Math.exp(-z));
};

/*
 * Trains the classifier on a given training example.
 */
Classifier.prototype.train = function(expectedValue, data) {

};

/*
 * Predicts the probability of the specified value for the given data.
 *
 * w = Vector coefficients
 * data = Matrix of training data vecors (X1, X2, ..., Xn)
 */
Classifier.prototype.predict = function(w, data) {
  return this.logistic(w.dot(data));
};

/*
 * Classifies the provided example.
 *
 * w = Vector coefficients
 * data = Matrix of training data vecors (X1, X2, ..., Xn)
 */
Classifier.prototype.classify = function(w, data) {
  var prediction = this.predict(w, data);

  return (prediction > 0.5) ? 1 : 0;
};

module.exports = Classifier;
