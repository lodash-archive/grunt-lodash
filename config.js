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