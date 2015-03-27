/* logistical.js
 *
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
var ALPHA = 0.0001;       // learning rate, should be small
var MAX_ERROR = 0.0005;	  // threshold which, if reached, will stop descent automatically
var LOGGING = false;       // Whether we turn on logging or not

/*
 * Main classifier entity.
 *
 * Based off of the algorithms presented in this paper also included in the repo
 * http://cs229.stanford.edu/notes/cs229-notes1.pdf
 */
var Classifier = function() {
  this.coefficientModel = [];
};

/*
 * Intermediate function for calculating the partial sum for the likelihood
 *
 * ThetaT = vector coefficients with k elements
 * Xi = vector of training data with k elements
 */
Classifier.prototype.ThetaTdotX = function(ThetaT, Xi) {
  Support.assertNull(ThetaT, Xi);
  Support.assertVector(ThetaT, Xi);
  Support.assertEqualElementCount(ThetaT, Xi);

  // The math says we take the sum of terms 
  //
  // we have vectors so dot product while we account for the first term in the sum
  return 1.0 + ThetaT.dot(Xi);
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
 * Compute the log likelihood for a set of coefficients, data and labels
 *
 * Theta = Vector coefficients
 * Y = Vector of labels for the data (Y1, Y2, ..., Yn)
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 * C = Regularization constant
 */
Classifier.prototype.logLikelihood = function(Theta, Y, X, C) {
  Support.assertVector(Theta, Y);
  Support.assertMatrix(X);

  // Ensure the partial sum will not throw an error
  Support.assertEqualElementCount(Theta, X.row(1));

  var N = Y.cols();

  var sum = 0;

  for (var i = 1; i <= N; i++) {
    sum += Y.e(i) * Math.log(this.logistic(this.ThetaTdotX(Theta, X.row(i)))) + (1 - Y.e(i)) * Math.log(1.0 - this.logistic(this.ThetaTdotX(Theta, X.row(i))));
  }

  // Account for regularization
  sum -= 0.5 * C * Theta.dot(Theta);

  return sum;
};

/*
 * Compute the gradient of the log likelihood
 *
 * Theta = Vector coefficients
 * Y = array of labels for the data (Y1, Y2, ..., Yn)
 * X = Matrix of training data vecors (X1, X2, ..., Xn)
 * C = Regularization constant
 *
 * Returns a vector of gradients with respect to the coefficients
 */
Classifier.prototype.loglikelihoodGradient = function(Theta, X, Y, C) {
  Support.assertVector(Theta);
  Support.assertVector(Y);
  Support.assertMatrix(X);

  // Ensure the partial sum will not throw an error
  Support.assertEqualElementCount(Theta, X.row(1));

  var M = Theta.cols();
  var N = X.rows();

  var partialLatTheta = [];


  for (var j = 0; j < M; j++) {
    var sum = 0.0;

    for (var i = 1; i <= N; i++) {
      sum += (Y.e(i) - this.logistic(this.ThetaTdotX(Theta, X.row(i)))) * X.e(j+1,i);
    }

    // Account for regularization
    sum -= C * Theta.e(j+1);

    partialLatTheta[j] = sum;
  }

  return Linear.Vector.create(partialLatTheta);
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
 * Predicts the probability of the specified value for the given data.
 *
 * w = Vector coefficients
 * data = Matrix of training data vecors (X1, X2, ..., Xn)
 */
Classifier.prototype.predict = function(w, data) {
  return this.logistic(w.dot(data));
};

Classifier.prototype.gradientDescent = function(X, Y, C) {
  // start with random coefficients
  var Theta = this.generateRandomCoefficients(X.cols());
  var prevTheta;

  // console.log("Initial Coefficients");
  // console.log(Theta.inspect());

  for ( var s = 0; s <= DESCENT_STEPS; s++ ) {
    prevTheta = Theta;

    // Matrix math
    var gradient = this.loglikelihoodGradient(prevTheta, X, Y, C);
    var gradientByAlpha = gradient.multiply(ALPHA);

    Theta = Theta.add(gradientByAlpha);
  
    var diffs = Theta.subtract(prevTheta);
    var error = Math.abs(diffs.max());

    // console.log(Theta.inspect());
    // console.log(diffs);
    // console.log(s + "\t" + diffs.max() + "\t" + error + "\t" + MAX_ERROR);

    // Check convergence
    if (s > 0.05 * DESCENT_STEPS && error < MAX_ERROR) {
      console.log("Converged after " + s.toString() + " steps");
      break;
    } else if (s == DESCENT_STEPS) {
      console.log("Error: Gradient Descent is not converging");
      console.log("Final Coefficients");
      console.log(Theta.inspect());
      console.log("Convergence Test: " + error.toFixed(5));
      throw new Error('Error: Gradient Descent is not converging');
    }
  }

  console.log("Final Coefficients");
  console.log(Theta.inspect());

  return Theta;
};

/*
 * Trains the classifier on a given training example.
 */
Classifier.prototype.train = function(expectedValue, data) {
  // 1. Generate a random coefficient matrix
  // var w = this.generateCoefficients()
  // 2. Loop for N steps in the descent
  // 2a. Calculate the gradients for w
  //    gradient = this.loglikelihoodGradient()
  // 2b. Adjust w
  //    w += gradient;
  // 2c. Check error and end if below threshold
  //    err = this.calculateError()
  // Repeat

  // 3. Cross validation
  // this.calculateError()
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
