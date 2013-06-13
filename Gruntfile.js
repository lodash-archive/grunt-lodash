var config = require('./config');

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig(config);

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint:files', 'clean:test', 'lodash', 'nodeunit:test']);
  grunt.registerTask('travis', 'default');
};
