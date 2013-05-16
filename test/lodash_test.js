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

config.iifes.forEach(function(iife, idx){
  var testName = 'iife' + idx;
  nodeunit[testName] = function(test){
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash iife="' + iife + '"') > -1, 'should be built with the custom iife');

    test.done();
  };
});

config.allMethods.forEach(function(method, idx){
  var include = 'inc_' + idx;
  nodeunit[include] = function(test){
    test.expect(2);

    var filepath = tmpPath(include);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash include="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };

  var plus = 'plu_' + idx;
  nodeunit[plus] = function(test){
    test.expect(2);

    var filepath = tmpPath(plus);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash plus="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };

  var minus = 'min_' + idx;
  nodeunit[minus] = function(test){
    test.expect(2);

    var filepath = tmpPath(minus);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash minus="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };
});

config.settings.forEach(function(setting, idx){
  var testName = 'settings' + idx;
  nodeunit[testName] = function(test){
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash settings="' + setting + '"') > -1, 'should be built with the custom settings');

    test.done();
  };
});

config.moduleIds.forEach(function(moduleId, idx){
  var testName = 'moduleId' + idx;
  nodeunit[testName] = function(test){
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash moduleId="' + moduleId + '"') > -1, 'should be built with the custom moduleId');

    test.done();
  };
});