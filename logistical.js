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
 *
 * w = vector coefficients with k elements
 * Xi = vector of training data with k elements
 */
Classifier.prototype.ZiPartialSum = function(w, Xi) {
  var validator = new Validator();

  validator.isVector(w, Xi);

  var N = validator.hasEqualElementCount(w, Xi);

  var sum = 0;

  /*
   * @refactor
   * Shouldn't this just be the dot product of the two vectors?
   */
  for ( var k = 1; k <= N; k++) {
    sum += w.e(k) * Xi.e(k);
  }

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
  var val = new Validator();

  val.isVector(w);

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
