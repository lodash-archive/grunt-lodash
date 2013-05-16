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
    files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js', '!test/fixtures/**/*.js']
  }
};

config.modifiers.forEach(function(modifier){
  config.lodash[modifier] = {
    dest: 'tmp/' + modifier + '/lodash.js',
    options: {
      modifier: modifier,
      shortFlags: ['d']
    }
  };
});