var fs = require("fs");
var parse = require("csv-parse");
var assert = require("assert");
var classifier = require("../logistical.js");


describe('Logistical', function(){
  var subject;
  var contents;

  before(function(done){
    fs.readFile(__dirname + '/data/2015_car_data.csv', function (readError, data) {
      if (readError) throw readError;

      parse(data,{}, function(parseError, output) {
        if (parseError) throw parseError;

        debugger;

        contents = output;
        done();
      });
    });
  });

  beforeEach( function(done){
    subject = new classifier();
    done();
  });


  describe('', function(){
    it('should do something', function(done){
      done();
    });
  });
});
