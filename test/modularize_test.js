'use strict';

var path = require('path');

var grunt = require('grunt'),
    semver = require('semver');

var config = require('../config'),
    pkg = require('lodash-cli/package.json');

var nodeunit = exports.nodeunit = {};

var modularizeFiles = [
  'arrays/',
  'chaining/',
  'collections/',
  'functions/',
  'internals/',
  'objects/',
  'utilities/',
  'arrays.js',
  'chaining.js',
  'collections.js',
  'functions.js',
  'lodash.js',
  'objects.js',
  'support.js',
  'utilities.js'
];

var npmModularizeFiles = [
  '_arraypool',
  '_baseclone',
  '_basecreatecallback',
  '_baseeach',
  '_baseflatten',
  '_baseindexof',
  '_baseisequal',
  '_basemerge',
  '_baseuniq',
  '_cacheindexof',
  '_cachepush',
  '_charatcallback',
  '_compareascending',
  '_createaggregator',
  '_createbound',
  '_createcache',
  '_createiterator',
  '_createobject',
  '_defaultsiteratoroptions',
  '_eachiteratoroptions',
  '_escapehtmlchar',
  '_escapestringchar',
  '_forowniteratoroptions',
  '_getarray',
  '_getobject',
  '_htmlescapes',
  '_htmlunescapes',
  '_indicatorobject',
  '_isnode',
  '_iteratortemplate',
  '_keyprefix',
  '_largearraysize',
  '_lodashwrapper',
  '_maxpoolsize',
  '_noop',
  '_objectpool',
  '_objecttypes',
  '_reescapedhtml',
  '_reinterpolate',
  '_releasearray',
  '_releaseobject',
  '_renative',
  '_reunescapedhtml',
  '_setbinddata',
  '_shimisplainobject',
  '_shimkeys',
  '_slice',
  '_unescapehtmlchar',
  'after',
  'assign',
  'at',
  'bind',
  'bindall',
  'bindkey',
  'clone',
  'clonedeep',
  'compact',
  'compose',
  'contains',
  'countby',
  'createcallback',
  'curry',
  'debounce',
  'defaults',
  'defer',
  'delay',
  'difference',
  'escape',
  'every',
  'filter',
  'find',
  'findindex',
  'findkey',
  'findlast',
  'findlastindex',
  'findlastkey',
  'first',
  'flatten',
  'foreach',
  'foreachright',
  'forin',
  'forinright',
  'forown',
  'forownright',
  'functions',
  'groupby',
  'has',
  'identity',
  'indexby',
  'indexof',
  'initial',
  'intersection',
  'invert',
  'invoke',
  'isarguments',
  'isarray',
  'isboolean',
  'isdate',
  'iselement',
  'isempty',
  'isequal',
  'isfinite',
  'isfunction',
  'isnan',
  'isnull',
  'isnumber',
  'isobject',
  'isplainobject',
  'isregexp',
  'isstring',
  'isundefined',
  'keys',
  'last',
  'lastindexof',
  'map',
  'max',
  'memoize',
  'merge',
  'min',
  'mixin',
  'noconflict',
  'omit',
  'once',
  'pairs',
  'parseint',
  'partial',
  'partialright',
  'pick',
  'pluck',
  'pull',
  'random',
  'range',
  'reduce',
  'reduceright',
  'reject',
  'remove',
  'rest',
  'result',
  'sample',
  'shuffle',
  'size',
  'some',
  'sortby',
  'sortedindex',
  'support',
  'template',
  'templatesettings',
  'throttle',
  'times',
  'toarray',
  'transform',
  'unescape',
  'union',
  'uniq',
  'uniqueid',
  'values',
  'where',
  'without',
  'wrap',
  'zip',
  'zipobject'
];

function tmpPath(subdir, file) {
  return path.join('tmp', subdir, file).toLowerCase();
}

// modularize was introduced in 2.0.0
if (semver.lt(pkg.version, '2.0.0')) {
  process.exit(0);
}

/*----------------------------------------------------------------------------*/

config.modularize.forEach(function(exp) {
  var testName = 'modularize_' + exp;
  nodeunit[testName] = function(test) {
    test.expect(modularizeFiles.length);

    modularizeFiles.forEach(function(file) {
      var filepath = tmpPath(testName, file),
          exists = grunt.file.exists(filepath);

      test.ok(exists, 'should produce ' + filepath);

      // TODO: check header when lodash adds the CLI options passed
      // var source = grunt.file.read(filepath);
      // test.ok(source.indexOf('lodash modularize exports="' + exp + '"') > -1, 'should be built with the custom exports');
    });

    test.done();
  };
});

nodeunit['modularize_npm'] = function(test) {
  test.expect(npmModularizeFiles.length);

  npmModularizeFiles.forEach(function(file) {
    var filepath = tmpPath('modularize_npm', file),
        exists = grunt.file.exists(filepath);

    test.ok(exists, 'should produce ' + filepath);

    // TODO: check header when lodash adds the CLI options passed
    // var source = grunt.file.read(filepath);
    // test.ok(source.indexOf('lodash modularize exports="' + exp + '"') > -1, 'should be built with the custom exports');
  });

  test.done();
};

nodeunit['modularize_amd_default'] = function(test) {
  test.expect(modularizeFiles.length);

  modularizeFiles.forEach(function(file) {
    var filepath = tmpPath('modularize_amd_default', file),
        exists = grunt.file.exists(filepath);

    test.ok(exists, 'should produce ' + filepath);

    // TODO: check header when lodash adds the CLI options passed
    // var source = grunt.file.read(filepath);
    // test.ok(source.indexOf('lodash modularize exports="' + exp + '"') > -1, 'should be built with the custom exports');
  });

  test.done();
};
