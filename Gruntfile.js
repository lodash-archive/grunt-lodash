module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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

    lodash: {
      minified_amd_snippet: {
        dest: 'tmp/minified_amd_snippet/lodash.js',
        options: {
          exclude: [],
          shortFlags: ['s']
        }
      },
      template_build1: {
        dest: 'tmp/template_builds/template1.js',
        options: {
          template: 'test/fixtures/template/*.jst'
        }
      },
      template_build2: {
        dest: 'tmp/template_builds/template2.js',
        options: {
          template: './test/fixtures/template/*.jst'
        }
      },
      template_build3: {
        dest: 'tmp/template_builds/template3.js',
        options: {
          template: __dirname + '/test/fixtures/template/*.jst'
        }
      },
      template_build_amd: {
        dest: 'tmp/template_builds/template_amd.js',
        options: {
          exports: 'amd',
          template: 'test/fixtures/template/*.jst'
        }
      },
      template_build_amd_underscore: {
        dest: 'tmp/template_builds/template_amd_underscore.js',
        options: {
          moduleId: 'underscore',
          exports: 'amd',
          template: 'test/fixtures/template/*.jst'
        }
      },
      template_build_settings: {
        dest: 'tmp/template_builds/template_build_settings.js',
        options: {
          exports: 'amd',
          template: 'test/fixtures/template/*.tpl',
          settings: '{interpolate:/{{([\\s\\S]+?)}}/}'
        }
      },
      independent_debug_only: {
        dest: 'tmp/independent/debug_only.js',
        options: {
          shortFlags: ['d', 's']
        }
      },
      independent_debug_custom: {
        dest: 'tmp/independent/debug_custom.js',
        options: {
          modifier: 'backbone',
          shortFlags: ['d', 's']
        }
      },
      independent_minified_only: {
        dest: 'tmp/independent/minified_only.min.js',
        options: {
          shortFlags: ['m', 's']
        }
      },
      independent_minified_custom: {
        dest: 'tmp/independent/minified_custom.min.js',
        options: {
          modifier: 'backbone',
          shortFlags: ['m', 's']
        }
      },
      // TODO: CSP modifier test
      test: {
        dest: 'tmp/dep/lodash.js',
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
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js', '!test/fixtures/**/*.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint:files', 'lodash', 'nodeunit:test']);
  grunt.registerTask('travis', 'default');
};
