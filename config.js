var _ = require('lodash');

/** List of all Lo-Dash methods */
var lodashMethods = _.functions(_).filter(function(methodName) {
  return !/^_/.test(methodName);
});

/** List of all methods */
var allMethods = lodashMethods.concat('findWhere');

// Project configuration.
var config = module.exports = {

  modifiers: [
    'csp',
    'underscore',
    'modern',
    'backbone',
    'legacy',
    'mobile',
    'strict'
  ],

  badModifiers: [
    'blunderscore'
  ],

  categories: [
    'arrays',
    'chaining',
    'collections',
    'functions',
    'objects',
    'utilities'
  ],

  exports: [
    'amd',
    'commonjs',
    'global',
    'node',
    'none'
  ],

  iifes: [
    '!function(window,undefined){%output%}(this)'
  ],

  allMethods: allMethods,

  settings: [
    '{interpolate:/\{\{([\s\S]+?)\}\}/g}'
  ],

  clean: {
    test: ['tmp/']
  },

  nodeunit: {
    test: ['test/**/*_test.js']
  },

  watch: {
    scripts: {
      files: '<%= jshint.files %>',
      tasks: 'default',
      options: {
        interrupt: true
      }
    }
  },

  lodash: {},

  jshint: {
    options: {
      jshintrc: '.jshintrc'
    },
    files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
  }
};

config.modifiers.concat(config.badModifiers).forEach(function(modifier){
  config.lodash[modifier] = {
    dest: 'tmp/' + modifier + '/lodash.js',
    options: {
      modifier: modifier,
      shortFlags: ['d']
    }
  };
});

config.categories.forEach(function(category){
  config.lodash[category] = {
    dest: 'tmp/' + category + '/lodash.js',
    options: {
      category: category,
      shortFlags: ['d']
    }
  };
});

config.exports.forEach(function(exp){
  config.lodash[exp] = {
    dest: 'tmp/' + exp + '/lodash.js',
    options: {
      exports: exp,
      shortFlags: ['d']
    }
  };
});

config.iifes.forEach(function(iife, idx){
  var testName = 'iife' + idx;
  config.lodash[testName] = {
    dest: 'tmp/' + testName + '/lodash.js',
    options: {
      iife: iife,
      shortFlags: ['d']
    }
  };
});

config.allMethods.forEach(function(method, idx){
  var include = 'inc_' + idx;
  config.lodash[include] = {
    dest: 'tmp/' + include + '/lodash.js',
    options: {
      include: method,
      shortFlags: ['d']
    }
  };

  var plus = 'plu_' + idx;
  config.lodash[plus] = {
    dest: 'tmp/' + plus + '/lodash.js',
    options: {
      plus: method,
      shortFlags: ['d']
    }
  };

  var minus = 'min_' + idx;
  config.lodash[minus] = {
    dest: 'tmp/' + minus + '/lodash.js',
    options: {
      minus: method,
      shortFlags: ['d']
    }
  };
});

config.settings.forEach(function(setting, idx){
  var testName = 'settings' + idx;
  config.lodash[testName] = {
    dest: 'tmp/' + testName + '/lodash.js',
    options: {
      settings: setting,
      shortFlags: ['d']
    }
  };
});