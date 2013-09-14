var _ = require('lodash');
var semver = require('semver');

var pkg = require('lodash-cli/package.json');

/** List of all Lo-Dash methods */
var allMethods = _.functions(_).filter(function(methodName) {
  return !/^_/.test(methodName);
});

/** Project configuration */
var config = module.exports = {

  'modifiers': [
    'csp',
    'underscore',
    'modern',
    'backbone',
    'legacy',
    'mobile',
    'strict'
  ],

  'badModifiers': [
    'blunderscore'
  ],

  'categories': [
    'arrays',
    'chaining',
    'collections',
    'functions',
    'objects',
    'utilities'
  ],

  'exports': [
    'amd',
    'commonjs',
    'global',
    'node',
    'none'
  ],

  'modularize': [
    'amd',
    'node'
  ],

  'iifes': [
    '!function(window,undefined){%output%}(this)'
  ],

  'templates': [
    './test/fixtures/template/*.jst',
    './test/fixtures/template/*.tpl'
  ],

  'allMethods': allMethods,

  'settings': [
    '{interpolate:/\{\{([\s\S]+?)\}\}/g}'
  ],

  'moduleIds': [
    'underscore'
  ],

  'stdoutFlags': [
    '--stdout',
    'stdout'
  ],

  'stdoutShortFlags': [
    '-c',
    'c'
  ],

  'debugFlags': [
    '--debug',
    'debug'
  ],

  'debugShortFlags': [
    '-d',
    'd'
  ],

  'minifyFlags': [
    '--minify',
    'minify'
  ],

  'minifyShortFlags': [
    '-m',
    'm'
  ],

  'sourceMapFlags': [
    '--source-map',
    'source-map'
  ],

  'sourceMapShortFlags': [
    '-p',
    'p'
  ],

  'clean': {
    'test': ['tmp/']
  },

  'nodeunit': {
    'test': ['test/**/*_test.js']
  },

  'watch': {
    'scripts': {
      'files': '<%= jshint.files %>',
      'tasks': 'default',
      'options': {
        'interrupt': true
      }
    }
  },

  'lodash': {},

  'jshint': {
    'options': {
      'jshintrc': '.jshintrc'
    },
    'files': ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
  }
};

config.modifiers.concat(config.badModifiers).forEach(function(modifier) {
  config.lodash[modifier] = {
    'dest': 'tmp/' + modifier + '/lodash.js',
    'options': {
      'modifier': modifier,
      'shortFlags': ['d']
    }
  };
});

config.categories.forEach(function(category) {
  config.lodash[category] = {
    'dest': 'tmp/' + category + '/lodash.js',
    'options': {
      'category': category,
      'shortFlags': ['d']
    }
  };
});

config.exports.forEach(function(exp) {
  config.lodash[exp] = {
    'dest': 'tmp/' + exp + '/lodash.js',
    'options': {
      'exports': exp,
      'shortFlags': ['d']
    }
  };
});

if (semver.gte(pkg.version, '2.0.0')) {
  // modularize was introduced in 2.0.0
  config.modularize.forEach(function(exp) {
    var testName = 'modularize_' + exp;
    config.lodash[testName] = {
      'dest': 'tmp/' + testName,
      'options': {
        'modularize': true,
        'exports': exp,
        'shortFlags': ['d']
      }
    };
  });

  config.lodash['modularize_npm'] = {
    'dest': 'tmp/modularize_npm',
    'options': {
      'modularize': true,
      'exports': 'npm',
      'shortFlags': ['d']
    }
  };

  config.lodash['modularize_amd_default'] = {
    'dest': 'tmp/modularize_amd_default',
    'options': {
      'modularize': true,
      'shortFlags': ['d']
    }
  };
}

config.iifes.forEach(function(iife, idx) {
  var testName = 'iife' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'iife': iife,
      'shortFlags': ['d']
    }
  };
});

config.templates.forEach(function(template, idx) {
  var testName = 'template' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/templates.js',
    'options': {
      'template': template,
      'shortFlags': ['d']
    }
  };
});

config.allMethods.forEach(function(method) {
  var include = 'include_' + method;
  config.lodash[include] = {
    'dest': 'tmp/' + include + '/lodash.js',
    'options': {
      'include': method,
      'shortFlags': ['d']
    }
  };

  var plus = 'plus_' + method;
  config.lodash[plus] = {
    'dest': 'tmp/' + plus + '/lodash.js',
    'options': {
      'plus': method,
      'shortFlags': ['d']
    }
  };

  var minus = 'minus_' + method;
  config.lodash[minus] = {
    'dest': 'tmp/' + minus + '/lodash.js',
    'options': {
      'minus': method,
      'shortFlags': ['d']
    }
  };
});

config.settings.forEach(function(setting, idx) {
  var testName = 'settings' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'settings': setting,
      'shortFlags': ['d']
    }
  };
});

config.moduleIds.forEach(function(moduleId) {
  var testName = 'moduleId_' + moduleId;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'moduleId': moduleId,
      'shortFlags': ['d']
    }
  };
});

config.stdoutFlags.forEach(function(flag, idx) {
  var testName = 'stdoutFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'flags': [flag]
    }
  };
});

config.stdoutShortFlags.forEach(function(flag, idx) {
  var testName = 'stdoutShortFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'shortFlags': [flag]
    }
  };
});

config.debugFlags.forEach(function(flag, idx) {
  var testName = 'debugFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'flags': [flag]
    }
  };
});

config.debugShortFlags.forEach(function(flag, idx) {
  var testName = 'debugShortFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'shortFlags': [flag]
    }
  };
});

config.minifyFlags.forEach(function(flag, idx) {
  var testName = 'minifyFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'flags': [flag]
    }
  };
});

config.minifyShortFlags.forEach(function(flag, idx) {
  var testName = 'minifyShortFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'shortFlags': [flag]
    }
  };
});

config.sourceMapFlags.forEach(function(flag, idx) {
  var testName = 'sourceMapFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'flags': [flag]
    }
  };
});

config.sourceMapShortFlags.forEach(function(flag, idx) {
  var testName = 'sourceMapShortFlag' + idx;
  config.lodash[testName] = {
    'dest': 'tmp/' + testName + '/lodash.js',
    'options': {
      'shortFlags': [flag]
    }
  };
});
