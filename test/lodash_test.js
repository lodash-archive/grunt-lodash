var grunt = require('grunt');

exports.nodeunit = {
  lodash_dep: function(test){
    'use strict';

    test.expect(2);

    var actual = grunt.file.read('tmp/dep/lodash.js');
    var expected = grunt.file.read('test/fixtures/dep/lodash.js');
    test.equals(actual, expected, 'should generate a lodash using the dependency');

    var exists = grunt.file.exists('tmp/dep/lodash.min.js');
    test.ok(exists, 'should minify lodash as lodash.min');

    test.done();
  }
};
