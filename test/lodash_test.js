'use strict';

var grunt = require('grunt');

var path = require('path');

var config = require('../config');

function tmpPath(subdir){
  return path.join('tmp', subdir, 'lodash.js');
}

var nodeunit = exports.nodeunit = {};

config.modifiers.forEach(function(modifier){
  nodeunit[modifier] = function(test){
    test.expect(2);

    var filepath = tmpPath(modifier);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash ' + modifier) > -1, 'should be built with custom modifier');

    test.done();
  };
});

config.badModifiers.forEach(function(modifier){
  nodeunit[modifier] = function(test){
    test.expect(1);

    var filepath = tmpPath(modifier);

    var notExists = !grunt.file.exists(filepath);
    test.ok(notExists, 'should not produce a custom build');

    test.done();
  };
});

config.categories.forEach(function(category){
  nodeunit[category] = function(test){
    test.expect(2);

    var filepath = tmpPath(category);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash category="' + category +'"') > -1, 'should be built with the custom category');

    test.done();
  };
});

config.exports.forEach(function(exp){
  nodeunit[exp] = function(test){
    test.expect(2);

    var filepath = tmpPath(exp);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash exports="' + exp + '"') > -1, 'should be built with the custom exports');

    test.done();
  };
});