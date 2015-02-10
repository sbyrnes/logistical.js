var fs = require("fs");
var parse = require("csv-parse");
var assert = require("assert");
var classifier = require("../logistical.js");

describe('Logistical', function(){
  var subject;
  var contents;
  var training;
  var verfication;

  before(function(done){
    fs.readFile(__dirname + '/data/verification.csv', function (readError, data) {
      if (readError) throw readError;

      parse(data,{auto_parse: true}, function(parseError, output) {
        if (parseError) throw parseError;

        contents = output;
        verification = contents.slice(0, 100);
        training = contents.slice(100,contents.length - 1);
        done();
      });
    });

  });

  beforeEach( function(done){
    subject = new classifier();
    done();
  });


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
