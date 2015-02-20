var classifier = function() {};

classifier.prototype.train = function(result, data) {
};

classifier.prototype.classify = function(data) {
  return data[data.length - 1];
};

module.exports = classifier;
