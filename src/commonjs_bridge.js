var cachedModules = {};

// load all modules
for (var modulePath in window.__cjs_module__) {
    require(modulePath, modulePath);
}

function require(requiringFile, dependency) {

    if (window.__cjs_module__ === undefined) throw new Error("Could not find any modules. Did you remember to set 'preprocessors' in your Karma config?");
    if (window.__cjs_modules_root__ === undefined) throw new Error("Could not find CommonJS module root path. Please report this issue to the karma-commonjs project.");

    dependency = normalizePath(requiringFile, dependency, window.__cjs_modules_root__ || '');

    // find module
    var moduleFn = window.__cjs_module__[dependency];

    if (moduleFn === undefined) {
        var possibleDependencies = [
            dependency.split('.')[0] + '/Index.js',
            dependency.split('.')[0] + '/index.js',
            dependency.split('.')[0] + '/Index.coffee',
            dependency.split('.')[0] + '/index.coffee'
        ];

        for (var i = 0; i < possibleDependencies.length; i++) {

          dependency = possibleDependencies[i];
          moduleFn = window.__cjs_module__[dependency];

          if (typeof moduleFn !== 'undefined') {
              break;
          }
        }

        if (moduleFn === undefined) {
          throw new Error("Could not find module '" + dependency + "' from '" + requiringFile + "'");
        }
    }

    // run the module (if necessary)
    var module = cachedModules[dependency];
    if (module === undefined) {
        module = { exports: {} };
        cachedModules[dependency] = module;
        moduleFn(requireFn(dependency), module, module.exports);
    }
    return module.exports;
}

function requireFn(basepath) {
    return function(dependency) {
        return require(basepath, dependency);
    };
}

function normalizePath(basePath, relativePath, modulesRoot) {

    if (isFullPath(relativePath)) return relativePath;
    if (isNpmModulePath(relativePath)) basePath = modulesRoot;
    if (!isFullPath(basePath)) throw new Error("basePath should be full path, but was [" + basePath + "]");

    var baseComponents = basePath.split("/");
    var relativeComponents = relativePath.split("/");
    var nextComponent;
    
    if (!isNpmModulePath(relativePath)) {
        baseComponents.pop();     // remove file portion of basePath before starting
    }
    while (relativeComponents.length > 0) {
        nextComponent = relativeComponents.shift();

        if (nextComponent === ".") continue;
        else if (nextComponent === "..") baseComponents.pop();
        else baseComponents.push(nextComponent);
    }
    
    var normalizedPath = baseComponents.join("/");

    if (normalizedPath.substr(normalizedPath.length - 3) !== ".js") {
        if (isCoffeeScript(basePath)) {
            normalizedPath += ".coffee";
        }
        else {
            normalizedPath += ".js";
        }
    }

    return normalizedPath;


    function isFullPath(path) {
        var unixFullPath = (path.charAt(0) === "/");
        var windowsFullPath = (path.indexOf(":") !== -1);

        return unixFullPath || windowsFullPath;
    }

    function isNpmModulePath(path) {
      return path.charAt(0) !== ".";
    }
}

function isCoffeeScript(filepath) {
  return filepath.slice(-7) === '.coffee';
}