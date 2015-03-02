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

// module under test
var Classifier = require("../logistical.js");

/* Tests for main Classifier object. */
describe('Logistical', function(){
  var subject;      // Classifier to be tested

  // Large data set, derived from 2015 NHTSB vehicle efficiency tests
  // http://www.fueleconomy.gov/feg/download.shtml
  var large = {};
      large.data;         // Complete data set
      large.training;     // Training data set
      large.validation;   // Cross-validation data set
      large.resultIndex = 12; // Index of the result value in the training sets

  // Small data set, derived from fake admissions data
  // http://www.ats.ucla.edu/stat/r/dae/exlogit.htm
  var small = {};
      small.data;         // Complete data set
      small.training;     // Training data set
      small.validation;   // Cross-validation data set
      small.resultIndex = 2; // Index of the result value in the training sets

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
        })
      },
      function(nextStep) {
        // Read large test data set
        readCSVFile('/data/verification.csv', function(csvData){
          large.data         = csvData;
          large.validation   = csvData.slice(0, 100);
          large.training     = csvData.slice(100, csvData.length - 1);

          nextStep();
        })
      }],
      function(err, results) {
        done();
      }
    )


  });

  /* Tasks to complete before running each test */
  beforeEach( function(done){
    subject = new Classifier();
    done();
  });

  describe('#logistic', function() {
    it('correctly calculates the logistic function', function(){
      // expected values found using Wolfram Alpha:
      // (http://www.wolframalpha.com/input/?i=logistic+sigmoid+%280.75%29)
      assert.equal(0.5, subject.logistic(0.0));
      assert.equal(0.88080, subject.logistic(2).toFixed(5));
      assert.equal(0.73106, subject.logistic(1.0).toFixed(5));
      assert.equal(0.67918, subject.logistic(0.75).toFixed(5));
    });
  });

    /* Test classification of a value based on some training data */
  describe('#classify', function(){
    it('correctly classifies small test data', function(){
      // Train the classifier
      for(var i=0; i < small.training.length; i++) {
        subject.train(small.training[i][small.resultIndex],
                      small.training[i].slice(0,small.resultIndex-1))
      }

      // Verify correct classification
      for(var i=0; i < small.validation.length; i++) {
        var test = small.validation[i].slice(0, small.resultIndex - 1);
        var result = small.validation[i][small.resultIndex];

        assert.equal(result, subject.classify(test));
      }
    });
    it('correctly classifies large test data', function(){
      // Train the classifier
      for(var i=0; i < large.training.length; i++) {
        subject.train(large.training[i][large.resultIndex],
                      large.training[i].slice(0,large.resultIndex-1))
      }

      // Verify correct classification
      for(var i=0; i < large.validation.length; i++) {
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
