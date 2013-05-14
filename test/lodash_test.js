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
  csp_modifier: function(test){
    test.expect(4);

    var cspFilepath = grunt.config.get('lodash.csp_modifier.dest');
    var modernFilepath = grunt.config.get('lodash.modern_modifier.dest');

    var cspExists = grunt.file.exists(cspFilepath);
    var modernExists = grunt.file.exists(modernFilepath);
    test.ok(cspExists, 'should produce a CSP build');
    test.ok(modernExists, 'should produce a modern build');

    // remove copyright header and append to `sources`
    var cspSource = grunt.file.read(cspFilepath).replace(/^\/\**[\s\S]+?\*\/\n/, '');
    var modernSource = grunt.file.read(modernFilepath).replace(/^\/\**[\s\S]+?\*\/\n/, '');

    var noFunction = _.every([cspSource, modernSource], function(source) {
      // remove `Function` in `_.template` before testing for additional use
      return !/\bFunction\(/.test(source.replace(/\= *\w+\(\w+, *['"]return.+?apply[^)]+\)/, ''));
    });
    test.ok(noFunction, 'should not contain function other than in _.template');

    test.equal(cspSource, modernSource, 'should be the same build');

    test.done();
  },
  mobile_modifier: function(test){
    /* jshint eqeqeq: false */
    test.expect(5);

    var array = [1, 2, 3];
    var context = createContext();
    var object1 = [{ 'a': 1 }];
    var object2 = [{ 'b': 2 }];
    var object3 = [{ 'a': 1, 'b': 2 }];
    var circular1 = { 'a': 1 };
    var circular2 = { 'a': 1 };

    circular1.b = circular1;
    circular2.b = circular2;

    var filepath = grunt.config.get('lodash.mobile_modifier.dest');

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a mobile build');

    var source = grunt.file.read(filepath);

    vm.runInContext(source, context);
    var lodash = context._;

    test.deepEqual(lodash.merge(object1, object2), object3, 'should combine the 2 objects');
    test.deepEqual(lodash.sortBy([3, 2, 1], _.identity), array, 'should sort the array');
    test.strictEqual(lodash.isEqual(circular1, circular2), true, 'should treat circular args as equal');

    var actual = lodash.cloneDeep(circular1);
    test.ok(actual != circular1 && actual.b == actual, 'should clone circular objects deep');

    test.done();
  },
  modern_modifier: function(test){
    test.expect(2);

    var context = createContext();

    var filepath = grunt.config.get('lodash.modern_modifier.dest');

    var exists = grunt.file.exists(filepath);
    test.ok(exists, 'should produce a modern build');

    var source = grunt.file.read(filepath);

    vm.runInContext(source, context);
    var lodash = context._;

    test.strictEqual(lodash.isPlainObject(Object.create(null)), true, 'should treat Object.create(null) as a plain object');

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
