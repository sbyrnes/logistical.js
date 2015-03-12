/* logisticalTests.js
 *
 * Tests for the logistical.js library
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

// standard modules
var fs = require("fs");
var parse = require("csv-parse");
var assert = require("assert");
var async = require("async");
var linear = require("Sylvester");

// module under test
var Classifier = require("../logistical.js");

/* Tests for main Classifier object. */
describe('Logistical', function(){
  var subject;      // Classifier to be tested

  // Large data set, derived from 2015 NHTSB vehicle efficiency tests
  // http://www.fueleconomy.gov/feg/download.shtml
  var large = {};
      large.data = null;         // Complete data set
      large.training = null;     // Training data set
      large.validation = null;   // Cross-validation data set
      large.resultIndex = 12;    // Index of the result value in the training sets

  // Small data set, derived from fake admissions data
  // http://www.ats.ucla.edu/stat/r/dae/exlogit.htm
  var small = {};
      small.data = null;         // Complete data set
      small.training = null;     // Training data set
      small.validation = null;   // Cross-validation data set
      small.resultIndex = 2;     // Index of the result value in the training sets

  /* Tasks to complete before running any tests */
  before(function(done) {

    async.series([
      function(nextStep) {
        // Read small test data set
        readCSVFile('/data/small_data.csv', function(csvData){
          small.data       = csvData;
          small.validation = csvData.slice(1, 5); // skip header
          small.training   = csvData.slice(5, csvData.length - 1);

          nextStep();
        });
      },
      function(nextStep) {
        // Read large test data set
        readCSVFile('/data/large_data.csv', function(csvData){
          large.data         = csvData;
          large.validation   = csvData.slice(0, 100);
          large.training     = csvData.slice(100, csvData.length - 1);

          nextStep();
        });
      }],
      function(err, results) {
        done();
      }
    );


  });

  /* Tasks to complete before running each test */
  beforeEach( function() {
    subject = new Classifier();
  });

  /* Test computation of the logistic function */
  describe('#logistic', function() {
    it('does not allow null input', function() {
      assert.throws(function() {
        subject.logistic(null);
      },
      /numeric/
      );
    });

    it('does not allow non-numeric input', function() {
      assert.throws(function() {
        subject.logistic('asdf');
      },
      /numeric/
      );
    });

    it(' validates function works for known values', function(){
      // expected values found using Wolfram Alpha:
      // (http://www.wolframalpha.com/input/?i=logistic+sigmoid+%280.75%29)
      assert.equal(0.5, subject.logistic(0.0));
      assert.equal(0.88080, subject.logistic(2).toFixed(5));
      assert.equal(0.73106, subject.logistic(1.0).toFixed(5));
      assert.equal(0.67918, subject.logistic(0.75).toFixed(5));
    });
  });

  /* Test the intermediate sum function used in the calculation of logLikelihood */
  describe('#ZiPartialSum', function() {
    var w, X;

    beforeEach( function() {
      w = linear.Vector.create([1,2]);
      X = new linear.Matrix.create([[1,2],[3,4],[5,6]]);
    });

    it('tests arguments for the correct type', function() {
      assert.doesNotThrow( function() {
          subject.ZiPartialSum(w, X.row(1));
        }
      );
    });

    it('does not allow null input', function() {
      assert.throws( function() {
          subject.ZiPartialSum(null, null);
        }
      );
    });

    it('does not allow non-numeric input', function() {
      assert.throws( function() {
          subject.ZiPartialSum(2, 'bad');
        },
        TypeError
      );
    });

    it('tests that the vectors have the same number of elements', function() {
      var Z = linear.Matrix.create([[1,2,3],[4,5,6]]);

      assert.doesNotThrow( function() {
          subject.ZiPartialSum(w, X.row(1));
        },
        Error
      );

      assert.throws( function() {
          subject.ZiPartialSum(w. Z.row(1));
        },
        Error
      );
    });

    it('calculates the proper sum', function() {
      assert.equal(5, subject.ZiPartialSum(w, X.row(1)));
      assert.equal(11, subject.ZiPartialSum(w, X.row(2)));
      assert.equal(17, subject.ZiPartialSum(w, X.row(3)));
    });
  });

  describe('#logLikelihood', function() {
    var w, X, Y, LatW;

    var g = function(Y, Z) {
      return subject.logistic(Y * Z);
    };

    describe('single dependent variable', function() {
      beforeEach(function() {
        w = linear.Vector.create([1]);
        X = linear.Matrix.create([[1],[3],[6]]);
        Y = linear.Vector.create([1,0,1]);

        Z = [1 * 1, 1 * 3, 1 * 6];
        LatW = 0.0;

        for ( var i = 0; i < 3; i++ ) {
          LatW += Math.log( g(Y.e(i+1), Z[i]) );
        }
      });

      /*
       * Outlining the math steps we have
       *
       * Z[i] = sum[k]{w[k] * x[i][k]}
       *
       * g[i] = logistic(Y[i] * Z[i])
       *
       * L[w] = -sum[i]{log(g(Y[i],Z[i])}
       *
       * For our example data we have the following for the first term:
       *
       * Z[1] = 1 * 1
       * g[1] = logistic(Y[1] * Z[1])
       * L[w] = log(g(Y[1], Z[1]))
       *
       */
      it('without regularization', function() {
        var C = 0.0;

        /*
         * from wolfrom alpha
         * http://www.wolframalpha.com/input/?i=log%281+*+1%2F%281+%2B+exp%28-1*1%29%29%29+%2B+log%281%2F%281+%2B+exp%28-3*0%29%29%29+%2B+log%281%2F%281+%2B+exp%28-1*6%29%29%29
         */
        expectation = -1.00888;
        calculation = LatW.toFixed(5);
        result = subject.logLikelihood(w, Y, X, C).toFixed(5);

        assert.equal(expectation, result);
        assert.equal(calculation, result);
      });

      it('WITH regularization', function() {
        var C = 0.1;

        LatW = -LatW + 0.5 * C * w.dot(w);

        /*
         * from wolfrom alpha
         * http://www.wolframalpha.com/input/?i=log%281+*+1%2F%281+%2B+exp%28-1*1%29%29%29+%2B+log%281%2F%281+%2B+exp%28-3*0%29%29%29+%2B+log%281%2F%281+%2B+exp%28-1*6%29%29%29
         */
        expectation = 1.05888;
        calculation = LatW.toFixed(5);
        result = subject.logLikelihood(w, Y, X, C).toFixed(5);

        assert.equal(expectation, result);
        assert.equal(calculation, result);
      });
    });

    describe('2 dependent variables', function() {
      beforeEach(function() {
        w = linear.Vector.create([1,1]);
        X = linear.Matrix.create([[1,2],[3,4],[5,6]]);
        Y = linear.Vector.create([1,0,1]);
      });

      it('without regularization', function() {
        var C = 0.0;

        /*
         * from wolfrom alpha
         * http://www.wolframalpha.com/input/?i=log%28logistic+function+3%29+%2B+log%28logistic+function+0%29+%2B+log%28logistic+function+11%29
         */
        var expectation = -0.74175;
        var result = subject.logLikelihood(w, Y, X, C).toFixed(5);

        assert.equal(expectation, result);
      });

      it('WITH regularization', function() {
        var C = 0.1;

        /*
         * from wolfrom alpha
         * http://www.wolframalpha.com/input/?i=log%28logistic+function+3%29+%2B+log%28logistic+function+0%29+%2B+log%28logistic+function+11%29
         */
        var expectation = 0.84175;
        var result = subject.logLikelihood(w, Y, X, C).toFixed(5);

        assert.equal(expectation, result);
      });
    });
  });

  describe('#logLikelihoodGradient', function() {
    var w, X, Y, partialLatW, Z1, Z2, Z3;

    var g = function(Y, Z) {
      return subject.logistic(-Y * Z);
    };

    describe('single dependent variable', function() {
      beforeEach(function() {
        w = linear.Vector.create([1]);
        X = linear.Matrix.create([[1],[3],[6]]);
        Y = linear.Vector.create([1,0,1]);

        partialLatW = [0];

        // Since the only difference between regularization is a constant factor
        // work out the sum here
        Z1 = 1 * 1;
        Z2 = 1 * 3;
        Z3 = 1 * 6;

        partialLatW[0] += 1 * 1 * g(1, Z1);
        partialLatW[0] += 0 * 3 * g(0, Z2);
        partialLatW[0] += 1 * 6 * g(1, Z3);
      });

      it('without regularization', function() {
        var C = 0.0;

        var expectedPartialL = linear.Vector.create(partialLatW);
        var calculatedPartialL = subject.loglikelihoodGradient(w, X, Y, C);

        assert.equal(expectedPartialL.e(1).toFixed(5), calculatedPartialL.e(1).toFixed(5));
      });

      it('WITH regularization', function() {
        var C = 0.1;

        // Account for regularization
        partialLatW[0] = -partialLatW + C * 1;

        var expectedPartialL = linear.Vector.create(partialLatW);
        var calculatedPartialL = subject.loglikelihoodGradient(w, X, Y, C);

        assert.equal(expectedPartialL.e(1).toFixed(5), calculatedPartialL.e(1).toFixed(5));
      });
    });

    describe('2 dependent variables', function() {
      beforeEach(function() {
        w = linear.Vector.create([1,1]);
        X = linear.Matrix.create([[1,2],[3,4],[5,6]]);
        Y = linear.Vector.create([1,0,1]);

        partialLatW = [0,0];

        // Simple enough to calculate the vector components
        Z1 = 1 * 1 + 1 * 2;
        Z2 = 1 * 3 + 1 * 4;
        Z3 = 1 * 5 + 1 * 6;

        partialLatW[0] += 1 * 1 * g(1, Z1);
        partialLatW[0] += 0 * 3 * g(0, Z2);
        partialLatW[0] += 1 * 5 * g(1, Z3);

        partialLatW[1] += 1 * 2 * g(1, Z1);
        partialLatW[1] += 0 * 4 * g(0, Z2);
        partialLatW[1] += 1 * 6 * g(1, Z3);
      });

      it('without regularization', function() {
        var C = 0.0;

        expectedPartialL = linear.Vector.create(partialLatW);

        var calculatedPartialL = subject.loglikelihoodGradient(w, X, Y, C);

        assert.equal(expectedPartialL.e(1).toFixed(5), calculatedPartialL.e(1).toFixed(5));
        assert.equal(expectedPartialL.e(2).toFixed(5), calculatedPartialL.e(2).toFixed(5));
      });

      it('WITH regularization', function() {
        var C = 0.1;

        partialLatW[0] = -partialLatW[0] + C * 1;
        partialLatW[1] = -partialLatW[1] + C * 1;

        expectedPartialL = linear.Vector.create(partialLatW);

        var calculatedPartialL = subject.loglikelihoodGradient(w, X, Y, C);

        assert.equal(expectedPartialL.e(1).toFixed(5), calculatedPartialL.e(1).toFixed(5));
        assert.equal(expectedPartialL.e(2).toFixed(5), calculatedPartialL.e(2).toFixed(5));
      });
    });
  });

  /* Test classification of a value based on some training data */
  describe('#classify', function() {
    var i;

    it('correctly classifies fixed model (without training)', function() {
      // Create test data and coefficients who dot product P satisfies logistic(P) > 0.5
      // which should classify as 1
      var test = linear.Vector.create([1, 1, 1, 1]);
      var coefficients = linear.Vector.create([1, 1, 1, 1]);

      assert.equal(1, subject.classify(coefficients, test));

      test = linear.Vector.create([0.1, 0.1, 0.1, 0.1]);
      coefficients = linear.Vector.create([0.1, 0.1, 0.1, 0.1]);

      assert.equal(1, subject.classify(coefficients, test));

      // Create test data and coefficients who dot product P satisfies logistic(P) < 0.5
      // which should classify as 0
      test = linear.Vector.create([-1, -1, -1, -1]);
      coefficients = linear.Vector.create([1, 1, 1, 1]);

      assert.equal(0, subject.classify(coefficients, test));
    });

    it.skip('correctly classifies small test data', function() {
      // Train the classifier
      for(i = 0; i < small.training.length; i++) {
        subject.train(small.training[i][small.resultIndex],
                      small.training[i].slice(0,small.resultIndex-1));
      }

      // Verify correct classification
      for(i = 0; i < small.validation.length; i++) {
        var test = small.validation[i].slice(0, small.resultIndex - 1);
        var result = small.validation[i][small.resultIndex];

        assert.equal(result, subject.classify(test));
      }
    });

    it.skip('correctly classifies large test data', function(){
      // Train the classifier
      for(i = 0; i < large.training.length; i++) {
        subject.train(large.training[i][large.resultIndex],
                      large.training[i].slice(0,large.resultIndex-1));
      }

      // Verify correct classification
      for(i = 0; i < large.validation.length; i++) {
        var test = large.validation[i].slice(0, large.resultIndex - 1);
        var result = large.validation[i][large.resultIndex];

        assert.equal(result, subject.classify(test));
      }
    });
  });

  /* Test generation of random coefficient vectors for starting point of descent */
  describe('#generateRandomCoefficients', function() {
    it('should not accept a negative value', function() {
      assert.throws(function() {
        subject.generateRandomCoefficients(-5);
      });
    });

    it('should not accept a zero value', function() {
      assert.throws(function() {
        subject.generateRandomCoefficients(0);
      });
    });

    it('should generate a different matrix every time', function() {
      var w1 = subject.generateRandomCoefficients(10);
      var w2 = subject.generateRandomCoefficients(10);

      assert.ok(w1);
      assert.ok(w2);

      assert.equal(10, w1.dimensions().cols);
      assert.equal(10, w2.dimensions().cols);

      assert.ok(!w1.eql(w2));
    });
  });

  /* Test the calculation of error between the calculated and expected outcomes from a given input data set */
  describe('#calculateError', function() {
    it('should not allow null input values', function() {
      assert.throws(function() {
          subject.calculateError(null, null, null);
        },
        /Null/
      );
    });

    it('should not accept empty input values', function() {
      var w = linear.Vector.create([]);
      var X = linear.Matrix.create([[]]);
      var Y_exp = linear.Vector.create([]);

      assert.throws(function() {
          subject.calculateError(w, X, Y_exp);
        },
        /Empty/
      );
    });

    it('should not accept mismatched dimensions', function() {
      var w = linear.Vector.create([1,1,1,1,1]);
      var X = linear.Matrix.Zero(6,5);
      var Y_exp = linear.Vector.Zero(5);

      assert.throws(function() {
          subject.calculateError(w, X, Y_exp);
        },
        /dimensions/
      );
    });

    it('should calculate the correct error', function() {
      var w = linear.Vector.create([1,1]);
      var X = linear.Matrix.Zero(5, 2);
      var Y_exp = linear.Vector.create([0, 1, 0, 1, 0]);

      var err = subject.calculateError(w, X, Y_exp);

      assert.equal(0.4, err);
    });
  });

});

/* Reads and parses a CSV file */
function readCSVFile(filename, callback) {
  fs.readFile(__dirname + filename, function (readError, data) {
    if (readError) throw readError;

    parse(data,{auto_parse: true}, function(parseError, output) {
      if (parseError) throw parseError;

      callback(output);
    });
  });
}
