/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var math = require('mathjs');

/*
 * Main classifier entity.
 */
var Classifier = function() {};

/* Computes the logistic function value for a given input. */
Classifier.prototype.logistic = function(z) {
  return 1.0 / (1.0 + math.exp(z));
};

/* Trains the classifier on a given training example. */
Classifier.prototype.train = function(expectedValue, data) {
};

/* Classifies the provided example. */
Classifier.prototype.classify = function(data) {
  return data[data.length - 1];
};

module.exports = Classifier;
