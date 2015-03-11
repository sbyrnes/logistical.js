/* logistical.js
 *
 * Tests for the support library
 *
 * Authors: Wes Bailey @baywes, Sean Byrnes @sbyrnes
 * Copyright 2015
 *
 * Made available via the MIT License, text included in LICENSE.
 */

// standard modules
var assert = require("assert");
var linear = require("Sylvester");

var support = require('../lib/support.js');

describe('support', function() {
  var test, result, vector;

  describe('Vector', function() {
    beforeEach(function() {
      test = [
        null,
        undefined,
        'string',
        [1,2,3],
        linear.Matrix.create([[1,2],[3,4]]),
        [
          linear.Vector.create([1,2,3]),
          null,
        ],
      ];

      vector = linear.Vector.create([1,2,3]);
    });

    describe('#isVector', function() {
      it('returns false for non-vectors', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isVector(test);
          assert.equal(false, result);
        }
      });

      it('returns true for vectors', function() {
        result = support.isVector(vector);
        assert.equal(true, result);
      });
    });

    describe('#assertVector', function() {
      it('throws error for non-vectors', function() {
        for (var i = 0; i < test.length; i++) {
          assert.throws(function() {
              support.assertVector(test[i]);
            },
            /TypeError/
          );
        }
      });

      it('does not throw error for vector', function() {
         assert.doesNotThrow(function() {
             support.assertVector(vector);
           },
           /Error/
         );
      });
    });
  });

  describe('Matrix', function() {
    beforeEach(function() {
      test = [
        null,
        undefined,
        'string',
        [1,2,3],
        linear.Vector.create([1,2,3,4]),
        [
          linear.Matrix.create([[1,2],[3,4]]),
          linear.Vector.create([1,2,3,4]),
        ],
      ];

      matrix = linear.Matrix.create([[1,2], [3,4]]);
    });
    
    describe('#isMatrix', function() {
      it('returns false for non-matrices', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isMatrix(test);
          assert.equal(false, result);
        }
      });

      it('returns true for matrices', function() {
        result = support.isMatrix(matrix);
        assert.equal(true, result);
      });
    });

    describe('#assertMatrix', function() {
      it('throws error for non-matrices', function() {
        for (var i = 0; i < test.length; i++) {
          assert.throws(function() {
              support.assertMatrix(test[i]);
            },
            /TypeError/
          );
        }
      });

      it('does not throw error for matrix', function() {
         assert.doesNotThrow(function() {
             support.assertMatrix(matrix);
           },
           /Error/
         );
      });
    });
  });

  describe('Array', function() {
    beforeEach(function() {
      test = [
        null,
        undefined,
        'string',
        linear.Vector.create([1,2,3]),
        linear.Matrix.create([[1,2],[3,4]]),
      ];

      array = [1,2,3];
    });

    describe('#isArray', function() {
      it('returns false for non-arrays', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isArray(test[i]);
          assert.equal(false, result);
        }
      });

      it('returns true for arrays', function() {
        result = support.isArray(array);
        assert.equal(true, result);
      });
    });

    describe('#assertArray', function() {
      it('throws error for non-arrays', function() {
        for (var i = 0; i < test.length; i++) {
          assert.throws(function() {
              support.assertArray(test[i]);
            },
            /TypeError/
          );
        }
      });

      it('does not throw error for array', function() {
         assert.doesNotThrow(function() {
             support.assertArray(array);
           },
           /Error/
         );
      });
    });
  });

  describe('Numeric', function() {
    beforeEach(function() {
      test = [
        'string',
        '123asb',
        [1,2,3],
        linear.Vector.create([1,2,3]),
        linear.Matrix.create([[1,2],[3,4]]),
      ];

      numeric = [
        1234,
        8.4,
        -1.23,
      ];
    });

    describe('#isNumeric', function() {
      it('returns false for non-numeric', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isNumeric(test[i]);
          assert.equal(false, result);
        }
      });

      it('returns true for numeric', function() {
        for (var i = 0, l = numeric.length; i < l; i++) {
          result = support.isNumeric(numeric[i]);
          assert.equal(true, result);
        }
      });
    });

    describe('#assertNumeric', function() {
      it('throws error for non-numeric', function() {
        for (var i = 0; i < test.length; i++) {
          assert.throws(function() {
              support.assertNumeric(test[i]);
            },
            /Error/
          );
        }
      });

      it('does not throw error for numeric', function() {
         assert.doesNotThrow(function() {
             support.assertNumeric(numeric[0], numeric[1], numeric[2]);
           },
           /Error/
         );
      });
    });
  });

  describe('Null', function() {
    beforeEach(function() {
      test = [
        'string',
        [1,2,3],
        linear.Vector.create([1,2,3]),
        linear.Matrix.create([[1,2],[3,4]]),
      ];
    });

    describe('#isNull', function() {
      it('returns false for non-null', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isNull(test[i]);
          assert.equal(false, result);
        }
      });

      it('returns true for null', function() {
        result = support.isNull(null);
        assert.equal(true, result);
      });
    });

    describe('#assertNull', function() {
      it('throws error for non-null', function() {
        for (var i = 0; i < test.length; i++) {
          assert.doesNotThrow(function() {
              support.assertNull(test[i]);
            },
            /Error/
          );
        }
      });

      it('does throw error for null', function() {
         assert.throws(function() {
             support.assertNull('asdf', null);
           },
           /Error/
         );
      });
    });
  });

  describe('Empty', function() {
    var empty;

    beforeEach(function() {
      test = [
        [1,2,3],
        linear.Vector.create([1,2,3]),
        linear.Matrix.create([[1,2],[3,4]]),
      ];

      empty = [
        [],
        linear.Vector.create([]),
        linear.Matrix.create([[]]),
      ];
    });

    describe('#isEmpty', function() {
      it('returns false for non-empty', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isEmpty(test[i]);
          assert.equal(false, result);
        }
      });

      it('returns true for empty', function() {
        for (var i = 0; i < test.length; i++) {
          result = support.isEmpty(empty[i]);
          assert.equal(true, result);
        }
      });
    });

    describe('#assertEmpty', function() {
      it('does not throw error for non-empty', function() {
        for (var i = 0; i < test.length; i++) {
          assert.doesNotThrow(function() {
              support.assertEmpty(test[i]);
            },
            /Error/
          );
        }
      });

      it('throws error for empty', function() {
        assert.throws(function() {
            support.assertEmpty(empty[0], empty[1], empty[3]);
          },
          /Error/
        );
      });
    });
  });
});
