var path = require('path');
var os = require('os');

var INITIALIZATION_FILE_PATH = path.normalize(__dirname + '/../client/commonjs_initialization.js');
var BRIDGE_FILE_PATH = path.normalize(__dirname + '/../client/commonjs_bridge.js');

var initCommonJS = function(/* config.files */ files) {

  files.unshift({
    pattern: INITIALIZATION_FILE_PATH,
    included: true,
    served: true,
    watched: false
  });

  // Include the file that resolves all the dependencies on the client.
  files.push({
    pattern: BRIDGE_FILE_PATH,
    included: true,
    served: true,
    watched: false
  });
};

var createPreprocessor = function(logger, config, basePath) {
  var log = logger.create('preprocessor.commonjs');
  var modulesRootPath = path.resolve(config && config.modulesRoot ? config.modulesRoot : path.join(basePath, 'node_modules'));
  //normalize root path on Windows
  if (process.platform === 'win32') {
    modulesRootPath = modulesRootPath.replace(/\\/g, '/');
  }

  log.debug('Configured root path for modules "%s".', modulesRootPath);

  return function(content, file, done) {
    if (file.originalPath === BRIDGE_FILE_PATH) {
      return done(content);
    }

    log.debug('Processing "%s".', file.originalPath);

    var indentStr = function(str) {
      return str.replace(/(\r\n|\n|\r)/g, '\n ');
    };

    // @TODO this should also work with JS files

    var output =
        'window.__cjs_module__["' + file.path + '"] = (require, module, exports) ->' +
        indentStr(content) + os.EOL;

    done(output);
  };
};
createPreprocessor.$inject = ['logger', 'config.commonjsPreprocessor', 'config.basePath'];

// PUBLISH DI MODULE
module.exports = {
  'framework:commonjs': ['factory', initCommonJS],
  'preprocessor:commonjs': ['factory', createPreprocessor]
};
