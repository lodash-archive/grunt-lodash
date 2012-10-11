/*global exports:true, require:true */

/*
 * grunt-lodashbuilder
 * https://github.com/asciidisco/grunt-lodashbuilder
 *
 * Copyright (c) 2012 asciidisco
 * Licensed under the MIT license.
 */

(function () {
  'use strict';

  // External libs.
  var _ = require('lodash');

  exports.init = function(grunt) {
    var exports = {};
    var Transport = function (type, content) {
      this.type = type;
      this.content = content;
    };

    // spawns the lodash build process
    exports.build = function (options, contentCb) {
      var lodashPath = require.resolve('lodash');
      var lodashVersion = 'latest';

      // check if we should use a different lodash version
      if (options.config.src) {
        try {
          grunt.file.read(options.config.src + '/build.js');
          lodashPath = options.config.src + '/lodash.js';
        } catch (e) {
          contentCb(new Transport('error', 'Could not load given lodash version at "' + options.config.src + '"'), options);
          return null;
        }
      }

      var mappedConfig = [lodashPath.replace('lodash.js', 'build.js'), '--stdout'];

      // load lodash version
      grunt.utils.spawn({
          cmd: 'node',
          args: [lodashPath.replace('lodash.js', 'build.js'), '--version']
      }, function (error, result, code) {
        var version = parseFloat(result.stdout);

        // check lodash version
        if (version >= 0.7) {

          // check for debug or minified output
          if (options.debug === true && version > 0.7) {
            mappedConfig.push('--debug');
          }

          // parse arguments
          var args = exports.parseArgs(options.config, mappedConfig);

          // launch lodash builder
          grunt.utils.spawn({
              cmd: 'node',
              args: args
          }, function (error, result, code) {
            var output = result.stdout;
            var outputSize = output.length;

            // catch lodash errors
            if (output.search("Invalid argument passed:") === 1) {
              contentCb(new Transport('error', result.stdout), options);
              return null;
            }

            // catch 'no output' failure
            if (outputSize === 0) {
              contentCb(new Transport('error', 'No output'), options);
              return null;
            }

            // catch lodash result
            if (outputSize > 0) {
              contentCb(new Transport('content', output), options);
            } else {
              // catch unexpected error
              contentCb(new Transport('error', 'Unknown'), options);
            }

            return null;
          });
        } else {
          contentCb(new Transport('error', 'Given lodash version (' + version + ') is too old, must 0.7 or higher'), options);
        }
      });
    };

    // spawns the lodash build process
    exports.parseArgs = function (config, mappedConfig) {

      _.each(config, function (item, key) {
        if (key !== 'src' && key !== 'dest' && key !== 'modifier' && key !== 'debug') {
          mappedConfig.push(key + '="' + (!_.isString(item) ? item.join(',') : item) + '"');
        }

        if (key === 'modifier') {
          mappedConfig.push(item);
        }
      });
      return mappedConfig;
    };

    return exports;
  };

}).call(this);