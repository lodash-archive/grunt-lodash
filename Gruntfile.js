module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    nodeunit: {
      test: ['test/**/*.js']
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

    lodash: {
      custom: {
        dest: 'build/lodash.custom.js'
      },
      options: {
        modifier: 'backbone',
        category: ['collections', 'functions'],
        exports: ['amd', 'commonjs', 'node'],
        iife: '!function(window,undefined){%output%}(this)',
        include: ['each', 'filter', 'map'],
        minus: ['result', 'shuffle'],
        plus: ['random', 'template'],
        // template: './*.jst',
        settings: '{interpolate:/\\{\\{([\\s\\S]+?)\\}\\}/g}',
        // flags: ['--source-map'],
        shortFlags: []
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint:files', 'nodeunit:test']);
  grunt.registerTask('travis', 'default');
};
