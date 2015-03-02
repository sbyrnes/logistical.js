/* logistical.js
 * A logistical regression classifier for Node.js
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

var fs = require("fs");
var parse = require("csv-parse");
var assert = require("assert");
var Classifier = require("../logistical.js");

/* Tests for main Classifier object. */
describe('Logistical', function(){
  var subject;      // Classifier to be tested
  var contents;     // All training data
  var training;     // Training data set
  var verfication;  // Cross-validation data set

  /* Tasks to complete before running any tests */
  before(function(done){
    fs.readFile(__dirname + '/data/verification.csv', function (readError, data) {
      if (readError) throw readError;

      parse(data,{auto_parse: true}, function(parseError, output) {
        if (parseError) throw parseError;

        contents = output;
        verification = contents.slice(0, 100);
        training = contents.slice(100, contents.length - 1);
        done();
      });
    });

  });

  /* Tasks to complete before running each test */
  beforeEach( function(done){
    subject = new Classifier();
    done();
  });

  /* Test computation of the logistic function */
  describe('#logistic', function() {
    it(' validates function works for known values', function(){
      assert.equal(0.5, subject.logistic(0.0));
    });
  });

    /* Test classification of a value based on some training data */
  describe('#classify', function(){
    it('correctly classifies test data', function(){
      for(var i=0; i < verification.length; i++) {
        var end = verification[i].length - 1;
        var test = verification[i].slice(0, end - 1);
        var result = verification[i][end];

        assert.equal(result, subject.classify(test));
      }
    });
  });
});
