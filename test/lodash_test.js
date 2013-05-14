'use strict';

var grunt = require('grunt');

var vm = require('vm');

var _ = require('lodash');

/**
 * Creates a context object to use with `vm.runInContext`.
 *
 * @private
 * @returns {Object} Returns a new context object.
 */
function createContext() {
  return vm.createContext({
    'clearTimeout': clearTimeout,
    'setTimeout': setTimeout
  });
}

exports.nodeunit = {
  minified_amd_snippet: function(test){
    test.expect(2);

    var filepath = 'tmp/minified_amd_snippet/lodash.min.js';

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a minified lodash file');

    var source = grunt.file.read(filepath);
    // used by r.js build optimizer
    var defineHasRegExp = /typeof\s+define\s*==(=)?\s*['"]function['"]\s*&&\s*typeof\s+define\.amd\s*==(=)?\s*['"]object['"]\s*&&\s*define\.amd/g;

    test.ok(!!defineHasRegExp.exec(source), 'should have non-minified AMD snippet');

    test.done();
  },
  template_builds: function(test){
    test.expect(44);

    var commands = [
      grunt.config.get('lodash.template_build1'),
      grunt.config.get('lodash.template_build2'),
      grunt.config.get('lodash.template_build3'),
    ];

    commands.forEach(function(command) {
      var context = createContext();

      var filepaths = [
        command.dest,
        command.dest.replace('.js', '.min.js')
      ];

      filepaths.forEach(function(filepath){
        var exists = grunt.file.exists(filepath);
        test.ok(exists, 'should produce a compiled template file');

        var source = grunt.file.read(filepath);

        var object = {
          'a': { 'people': ['moe', 'larry', 'curly'] },
          'b': { 'epithet': 'stooge' },
          'c': { 'name': 'ES6' }
        };

        context._ = _;
        vm.runInContext(source, context);

        var actual = _.templates.a(object.a);
        test.equal(actual.replace(/[\r\n]+/g, ''), '<ul><li>moe</li><li>larry</li><li>curly</li></ul>', 'should match `<ul><li>moe</li><li>larry</li><li>curly</li></ul>`');

        test.equal(_.templates.b(object.b), 'Hello stooge.', 'should match `Hello stooge.`');
        test.equal(_.templates.c(object.c), 'Hello ES6!', 'should match `Hello ES6!`');

        delete _.templates;
      });
    });

    commands = [
      grunt.config.get('lodash.template_build_amd'),
      grunt.config.get('lodash.template_build_amd_underscore'),
    ];

    commands.forEach(function(command){
      var expectedId = /underscore/.test(command.options.moduleId) ? 'underscore' : 'lodash';
      var moduleId;
      var context = createContext();

      var filepaths = [
        command.dest,
        command.dest.replace('.js', '.min.js')
      ];

      filepaths.forEach(function(filepath){
        var exists = grunt.file.exists(filepath);
        test.ok(exists, 'should produce a compiled template file');

        var source = grunt.file.read(filepath);

        context.define = function(requires, factory) {
          factory(_);
          moduleId = requires[0];
        };

        context.define.amd = {};
        vm.runInContext(source, context);

        test.equal(moduleId, expectedId, 'should have the correct moduleId');
        test.ok('a' in _.templates && 'b' in _.templates, 'should have properties `a` and `b` in _.template');

        var actual = _.templates.a({ 'people': ['moe', 'larry'] });
        test.equal(actual.replace(/[\r\n]+/g, ''), '<ul><li>moe</li><li>larry</li></ul>', 'should match `<ul><li>moe</li><li>larry</li></ul>`');

        delete _.templates;
      });

    });

    commands = [
      grunt.config.get('lodash.template_build_settings')
    ];

    commands.forEach(function(command){
      var context = createContext();

      var filepaths = [
        command.dest,
        command.dest.replace('.js', '.min.js')
      ];

      filepaths.forEach(function(filepath){
        var exists = grunt.file.exists(filepath);
        test.ok(exists, 'should produce a compiled template file');

        var source = grunt.file.read(filepath);

        var object = {
          'd': { 'name': 'Mustache' }
        };

        context.define = function(requires, factory) {
          factory(_);
        };

        context.define.amd = {};
        vm.runInContext(source, context);

        test.equal(_.templates.d(object.d), 'Hello Mustache!', 'should match `Hello Mustache!`');
        delete _.templates;
      });

    });

    test.done();
  },
  independent: function(test){
    test.expect(10);

    var reCustom = /Custom Build/;
    var reLicense = /^\/\**\s+\* @license[\s\S]+?\*\/\n/;

    var filepath = grunt.config.get('lodash.independent_debug_only.dest');
    var exists = grunt.file.exists(filepath);
    var notExists = !grunt.file.exists(filepath.replace('.js', '.min.js'));
    test.ok(exists, 'should produce non-minified version');
    test.ok(notExists, 'should not produce minified version');

    filepath = grunt.config.get('lodash.independent_debug_custom.dest');
    exists = grunt.file.exists(filepath);
    notExists = !grunt.file.exists(filepath.replace('.js', '.min.js'));
    test.ok(exists, 'should produce non-minified version');
    test.ok(notExists, 'should not produce minified version');

    var source = grunt.file.read(filepath);

    var comment = source.match(reLicense);
    test.ok(reCustom.test(comment));

    filepath = grunt.config.get('lodash.independent_minified_only.dest');
    exists = grunt.file.exists(filepath);
    notExists = !grunt.file.exists(filepath.replace('.min.js', '.js'));
    test.ok(exists, 'should produce non-minified version');
    test.ok(notExists, 'should not produce minified version');

    filepath = grunt.config.get('lodash.independent_minified_custom.dest');
    exists = grunt.file.exists(filepath);
    notExists = !grunt.file.exists(filepath.replace('.min.js', '.js'));
    test.ok(exists, 'should produce non-minified version');
    test.ok(notExists, 'should not produce minified version');

    source = grunt.file.read(filepath);

    comment = source.match(reLicense);
    test.ok(reCustom.test(comment));

    test.done();
  },
  lodash_dep: function(test){

    test.expect(2);

    var actual = grunt.file.read('tmp/dep/lodash.js');
    var expected = grunt.file.read('test/fixtures/dep/lodash.js');
    test.equals(actual, expected, 'should generate a lodash using the dependency');

    var exists = grunt.file.exists('tmp/dep/lodash.min.js');
    test.ok(exists, 'should minify lodash as lodash.min');

    test.done();
  }
};
