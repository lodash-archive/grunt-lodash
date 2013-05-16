'use strict';

var grunt = require('grunt');

var config = require('../config');

var nodeunit = exports.nodeunit = {};

config.modifiers.forEach(function(modifier){
  nodeunit[modifier] = function(test){
    test.expect(2);

    var filepath = 'tmp/' + modifier + '/lodash.js';

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash ' + modifier) > -1, 'should be built with custom modifier');

    test.done();
  };
});
