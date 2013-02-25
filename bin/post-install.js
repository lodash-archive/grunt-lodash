#!/usr/bin/env node

// Post install script for closure compiler & uglyfyjs
// most parts are shamelessly stolen from lodash´s minify.js
;(function() {
  'use strict';

  /** Load Node modules */
  var fs = require('fs'),
      https = require('https'),
      path = require('path'),
      spawn = require('child_process').spawn,
      zlib = require('zlib'),
      tar = require('../node_modules/lodash/vendor/tar/tar.js'),
      _ = require('../node_modules/lodash/lodash.js');

  /** The Git object ID of `closure-compiler.tar.gz` */
  var closureId = '23cf67d0f0b979d97631fc108a2a43bb82225994';

  /** The Git object ID of `uglifyjs.tar.gz` */
  var uglifyId = 'a934fb18f8fa2768c6a68de44b6e035fe96a268b';

  /** The path of the directory that is the base of the repository */
  var basePath = fs.realpathSync(path.join(__dirname, '../node_modules/lodash/'));

  /** The path of the `vendor` directory */
  var vendorPath = path.join(basePath, 'vendor');

  /** The path to the Closure Compiler `.jar` */
  var closurePath = path.join(vendorPath, 'closure-compiler', 'compiler.jar');

  /** The path to the UglifyJS module */
  var uglifyPath = path.join(vendorPath, 'uglifyjs', 'tools', 'node.js');

  /** The Closure Compiler command-line options */
  var closureOptions = ['--warning_level=QUIET'];

  /** The media type for raw blob data */
  var mediaType = 'application/vnd.github.v3.raw';

  /** Used to reference parts of the blob href */
  var location = (function() {
    var host = 'api.github.com',
        origin = 'https://api.github.com',
        pathname = '/repos/bestiejs/lodash/git/blobs';

    return {
      'host': host,
      'href': origin + pathname,
      'origin': origin,
      'pathname': pathname
    };
  }());

  // copy file sync helper function
  var copyFileSync = function (srcFile, destFile) {
    var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
    BUF_LENGTH = 64 * 1024;
    buff = new Buffer(BUF_LENGTH);
    fdr = fs.openSync(srcFile, 'r');
    fdw = fs.openSync(destFile, 'w');
    bytesRead = 1;
    pos = 0;
    while (bytesRead > 0) {
      bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
      fs.writeSync(fdw, buff, 0, bytesRead);
      pos += bytesRead;
    }
    fs.closeSync(fdr);
    return fs.closeSync(fdw);
  };


  /**
   * Fetches a required `.tar.gz` dependency with the given Git object ID from
   * the Lo-Dash repo on GitHub. The object ID may be obtained by running
   * `git hash-object path/to/dependency.tar.gz`.
   *
   * @private
   * @param {Object} options The options object.
   *  id - The Git object ID of the `.tar.gz` file.
   *  onComplete - The function called once the extraction has finished.
   *  path - The path of the extraction directory.
   *  title - The dependency's title used in status updates logged to the console.
   */
  function getDependency(options) {
    options || (options = {});

    var ran,
        destPath = options.path,
        hashId = options.hashId,
        id = options.id,
        onComplete = options.onComplete,
        title = options.title;

    // exit early if dependency exists
    if (fs.existsSync(path.join(destPath, id))) {
      onComplete();
      return;
    }
    var callback = function(exception) {
      if (ran) {
        return;
      }
      if (exception) {
        console.error([
          'There was a problem installing ' + title + '.',
          'Try running the command as root, via `sudo`, or manually install by running:',
          '',
          "curl -H 'Accept: " + mediaType + "' " + location.href + '/' + hashId + " | tar xvz -C '" + destPath + "'",
          ''
        ].join('\n'));
      }
      ran = true;
      process.removeListener('uncaughtException', callback);
      onComplete(exception);
    };

    console.log('Downloading ' + title + '...');
    process.on('uncaughtException', callback);

    https.get({
      'host': location.host,
      'path': location.pathname + '/' + hashId,
      'headers': {
        // By default, all GitHub blob API endpoints return a JSON document
        // containing Base64-encoded blob data. Overriding the `Accept` header
        // with the GitHub raw media type returns the blob data directly.
        // See http://developer.github.com/v3/media/.
        'Accept': mediaType
      }
    }, function(response) {
      var decompressor = zlib.createUnzip(),
          parser = new tar.Extract({ 'path': destPath });

      parser.on('end', callback);
      response.pipe(decompressor).pipe(parser);
    });
  }

    // fetch the Closure Compiler
    getDependency({
      'id': 'closure-compiler',
      'hashId': closureId,
      'path': vendorPath,
      'title': 'the Closure Compiler',
      'onComplete': function(exception) {
        var error = exception;

        // fetch UglifyJS
        getDependency({
          'id': 'uglifyjs',
          'hashId': uglifyId,
          'title': 'UglifyJS',
          'path': vendorPath,
          'onComplete': function(exception) {
            error || (error = exception);
            if (!error) {
              console.log('Third party minifiers downloaded successfully!');
            }
          }
        });
      }
    });

}());
