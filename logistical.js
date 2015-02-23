var math = require('mathjs');

var classifier = function() {};

classifier.prototype.logit = function(z) {
  return 1.0 / (1.0 + math.exp(z));
};

classifier.prototype.train = function(result, data) {
};

classifier.prototype.classify = function(data) {
  return data[data.length - 1];
};

module.exports = classifier;
