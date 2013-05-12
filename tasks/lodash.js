/*
 * grunt-lodash
 * https://github.com/lodash/grunt-lodash
 *
 * Copyright (c) 2012 asciidisco
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  var pkg = require('lodash/package.json');
  var bin = pkg.bin.lodash;
  var builder = require.resolve('lodash/' + bin);

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('lodash', 'Builds a customized Lo-Dash', function (mode) {
    var done = this.async();
    var opts = this.options({
      modifier: '',
      flags: [],
      shortFlags: []
    });

    var _ = grunt.util._;
    var args = _.map(_.omit(opts, 'modifier', 'flags', 'shortFlags'), function(val, opt){
      if(Array.isArray(val)){
        val = val.join(',');
      }
      return opt + '=' + val;
    });

    var flags = _.map(opts.flags, function(flag){
      if(flag.indexOf('--') > -1){
        return flag;
      }
      return '--' + flag;
    });

    var shortFlags = _.map(opts.shortFlags, function(flag){
      if(flag.indexOf('-') > -1){
        return flag;
      }
      return '-' + flag;
    });

    var output = ['--output', this.files[0].dest];

    grunt.util.spawn({
      cmd: 'node',
      args: [builder, opts.modifier].concat(args).concat(output).concat(flags).concat(shortFlags)
    }, function(err, data){
      if(err){
        grunt.log.error(err.toString());
        done(err);
      }
      grunt.log.write(data.toString());
      done();
    });
  });

};
