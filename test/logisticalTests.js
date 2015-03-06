/* logistical.js
 * A logistical regression classifier for Node.js
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
var linear = require("sylvester");

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
  before(function(done){

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
      assert.doesNotThrow( function() { subject.ZiPartialSum(w, X.row(1)); }, TypeError );
      assert.throws( function() { subject.ZiPartialSum(2, 'bad'); }, TypeError);
    });

    it('tests that the vectors have the same number of elements', function() {
      var Z = linear.Matrix.create([[1,2,3],[4,5,6]]);

      assert.doesNotThrow( function() { subject.ZiPartialSum(w, X.row(1)); }, Error );
      assert.throws( function() {subject.ZiPartialSum(w. Z.row(1)); }, Error);
    });

    it('calculates the proper sum', function() {
      assert.equal(5, subject.ZiPartialSum(w, X.row(1)));
      assert.equal(11, subject.ZiPartialSum(w, X.row(2)));
      assert.equal(17, subject.ZiPartialSum(w, X.row(3)));
    });
  });

  describe('#logLikelihood', function() {
    describe('without regularization', function() {
      var C = 0.0;

      it('computes the logLikelihood for a single dependent variable', function() {
        var w = linear.Vector.create([1]);
        var X = new linear.Matrix.create([[1],[3],[6]]);
        var Y = [1,0,1];

        /*
         * Simple enough to outline the component steps
         *
         * Z[0] = 1*1
         * logistic[0] = 1/(1 + exp(-1*1))
         * sum[0] = log(1 * 1/(1 + exp(-1*1)))
         *
         * Z[1] = 1*3
         * logistic[1] = 1/(1 + exp(-3*0))
         * sum[1] = log(1/(1 + exp(-3*0)))
         *
         * Z[2] = 1*6
         * logistic[2] = 1/(1 + exp(-1*6))
         * sum[2] = log(1/(1 + exp(-1*6)))
         *
         * L(w) = sum[0] + sum[1] + sum[2]
         */
        // from wolfrom alpha
        // http://www.wolframalpha.com/input/?i=log%281+*+1%2F%281+%2B+exp%28-1*1%29%29%29+%2B+log%281%2F%281+%2B+exp%28-3*0%29%29%29+%2B+log%281%2F%281+%2B+exp%28-1*6%29%29%29
        assert.equal(-1.00888, subject.logLikelihood(w, Y, X, C).toFixed(5));
      });

      it('computes the logLikelihood for 2 dependent variables', function() {
        var w = linear.Vector.create([1,1]);
        var X = new linear.Matrix.create([[1,2],[3,4],[5,6]]);
        var Y = [1,0,1];
        // from wolfrom alpha
        // http://www.wolframalpha.com/input/?i=log%28logistic+function+3%29+%2B+log%28logistic+function+0%29+%2B+log%28logistic+function+11%29
        assert.equal(-0.74175, subject.logLikelihood(w, Y, X, C).toFixed(5));
      });
    });
    describe('with regularization', function() {
      var C = 0.1;

      it('computes the logLikelihood for a single dependent variable', function() {
        var w = linear.Vector.create([1]);
        var X = new linear.Matrix.create([[1],[3],[6]]);
        var Y = [1,0,1];

        /*
         * Simple enough to outline the component steps
         *
         * Z[0] = 1*1
         * logistic[0] = 1/(1 + exp(-1*1))
         * sum[0] = log(1 * 1/(1 + exp(-1*1)))
         *
         * Z[1] = 1*3
         * logistic[1] = 1/(1 + exp(-3*0))
         * sum[1] = log(1/(1 + exp(-3*0)))
         *
         * Z[2] = 1*6
         * logistic[2] = 1/(1 + exp(-1*6))
         * sum[2] = log(1/(1 + exp(-1*6)))
         *
         * L(w) = -(sum[0] + sum[1] + sum[2]) + 0.5 * C * w dot w
         */
        // from wolfrom alpha
        // http://www.wolframalpha.com/input/?i=log%281+*+1%2F%281+%2B+exp%28-1*1%29%29%29+%2B+log%281%2F%281+%2B+exp%28-3*0%29%29%29+%2B+log%281%2F%281+%2B+exp%28-1*6%29%29%29
        assert.equal(1.05888, subject.logLikelihood(w, Y, X, C).toFixed(5));
      });

      it('computes the logLikelihood for 2 dependent variables', function() {
        var w = linear.Vector.create([1,1]);
        var X = new linear.Matrix.create([[1,2],[3,4],[5,6]]);
        var Y = [1,0,1];
        // from wolfrom alpha
        // http://www.wolframalpha.com/input/?i=log%28logistic+function+3%29+%2B+log%28logistic+function+0%29+%2B+log%28logistic+function+11%29
        assert.equal(0.84175, subject.logLikelihood(w, Y, X, C).toFixed(5));
      });
    });
  });

  /* Test classification of a value based on some training data */
  describe.skip('#classify', function() {
    var i;

    it('correctly classifies small test data', function() {
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

    it('correctly classifies large test data', function(){
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
