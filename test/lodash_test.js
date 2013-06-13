'use strict';

var grunt = require('grunt');

var path = require('path');

var _ = require('lodash');

var config = require('../config');

function tmpPath(subdir) {
  return path.join('tmp', subdir, 'lodash.js');
}

var nodeunit = exports.nodeunit = {};

config.modifiers.forEach(function(modifier) {
  nodeunit[modifier] = function(test) {
    test.expect(2);

    var filepath = tmpPath(modifier);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash ' + modifier) > -1, 'should be built with custom modifier');

    test.done();
  };
});

config.badModifiers.forEach(function(modifier) {
  nodeunit[modifier] = function(test) {
    test.expect(1);

    var filepath = tmpPath(modifier);

    var notExists = !grunt.file.exists(filepath);
    test.ok(notExists, 'should not produce a custom build');

    test.done();
  };
});

config.categories.forEach(function(category) {
  nodeunit[category] = function(test) {
    test.expect(2);

    var filepath = tmpPath(category);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash category="' + category +'"') > -1, 'should be built with the custom category');

    test.done();
  };
});

config.exports.forEach(function(exp) {
  nodeunit[exp] = function(test) {
    test.expect(2);

    var filepath = tmpPath(exp);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash exports="' + exp + '"') > -1, 'should be built with the custom exports');

    test.done();
  };
});

config.iifes.forEach(function(iife, idx) {
  var testName = 'iife' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash iife="' + iife + '"') > -1, 'should be built with the custom iife');

    test.done();
  };
});

config.templates.forEach(function(template, idx) {
  var testName = 'template' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    // var filepath = tmpPath(testName);
    var filepath = 'tmp/' + testName + '/templates.js';

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a built template JS file');

    var templates = require('../' + filepath);
    var keys = Object.keys(_.omit(templates, 'templates'));

    test.ok(keys.length > 0, 'should attach template names to the templates object');

    test.done();
  };
});

config.allMethods.forEach(function(method, idx) {
  var include = 'include_' + idx;
  nodeunit[include] = function(test) {
    test.expect(2);

    var filepath = tmpPath(include);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash include="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };

  var plus = 'plus_' + idx;
  nodeunit[plus] = function(test) {
    test.expect(2);

    var filepath = tmpPath(plus);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash plus="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };

  var minus = 'minus_' + idx;
  nodeunit[minus] = function(test) {
    test.expect(2);

    var filepath = tmpPath(minus);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash minus="' + method + '"') > -1, 'should be built with the method included');

    test.done();
  };
});

config.settings.forEach(function(setting, idx) {
  var testName = 'settings' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash settings="' + setting + '"') > -1, 'should be built with the custom settings');

    test.done();
  };
});

config.moduleIds.forEach(function(moduleId, idx) {
  var testName = 'moduleId' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash moduleId="' + moduleId + '"') > -1, 'should be built with the custom moduleId');

    test.done();
  };
});

config.stdoutFlags.forEach(function(flag, idx) {
  var testName = 'stdoutFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(1);

    var filepath = tmpPath(testName);

    var notExists = !grunt.file.exists(filepath);
    test.ok(notExists, 'should not produce a custom build on the filesystem');

    test.done();
  };
});

config.stdoutShortFlags.forEach(function(flag, idx) {
  var testName = 'stdoutShortFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(1);

    var filepath = tmpPath(testName);

    var notExists = !grunt.file.exists(filepath);
    test.ok(notExists, 'should not produce a custom build on the filesystem');

    test.done();
  };
});

config.debugFlags.forEach(function(flag, idx) {
  var testName = 'debugFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash --debug') > -1, 'should be built with the debug flag');

    test.done();
  };
});

config.debugShortFlags.forEach(function(flag, idx) {
  var testName = 'debugShortFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash -d') > -1, 'should be built with the debug flag');

    test.done();
  };
});

config.minifyFlags.forEach(function(flag, idx) {
  var testName = 'minifyFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash --minify') > -1, 'should be built with the minify flag');

    test.done();
  };
});

config.minifyShortFlags.forEach(function(flag, idx) {
  var testName = 'minifyShortFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(2);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash -m') > -1, 'should be built with the minify flag');

    test.done();
  };
});

config.sourceMapFlags.forEach(function(flag, idx) {
  var testName = 'sourceMapFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(3);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash --source-map') > -1, 'should be built with the source-map flag');

    filepath = filepath.replace('.js', '.min.map');

    exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a source-map file');

    test.done();
  };
});

config.sourceMapShortFlags.forEach(function(flag, idx) {
  var testName = 'sourceMapShortFlag' + idx;
  nodeunit[testName] = function(test) {
    test.expect(3);

    var filepath = tmpPath(testName);

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a custom build');

    var source = grunt.file.read(filepath);

    test.ok(source.indexOf('lodash -p') > -1, 'should be built with the source-map flag');

    filepath = filepath.replace('.js', '.min.map');

    exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a source-map file');

    test.done();
  };
});
