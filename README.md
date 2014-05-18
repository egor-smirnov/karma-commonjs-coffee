[![Build Status](https://travis-ci.org/lastday/karma-commonjs-coffee.svg?branch=master)](https://travis-ci.org/lastday/karma-commonjs-coffee)

# karma-commonjs-coffee

This is fork of [karma-commonjs] (http://github.com/karma-runner/karma-commonjs) which has better support of CoffeeScript including appropriate CoffeeScript coverage.

For more information about what karma-commonjs is for, please visit [this page](http://github.com/karma-runner/karma-commonjs)

> Under development now, won't work as it should at the moment :(

## Installation

The easiest way is to keep `karma-commonjs-coffee` as a devDependency:

`npm install karma-commonjs-coffee --save-dev`

which should result in the following entry in your `package.json`:

```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-commonjs-coffee": "~0.2"
  }
}
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'commonjs'],
    files: [
      // your tests, sources, ...
    ],

    preprocessors: {
      '**/*.js': ['commonjs']
    }
  });
};
```
Additionally you can specify a root folder (relative to project's directory) which is used to look for required modules:
```
commonjsPreprocessor: {
  modulesRoot: 'some_folder'  
}
```
When not specified the root folder default to the `karma.basePath/node_modules` configuration option.

## Links

+   [karma-commonjs](http://github.com/karma-runner/karma-commonjs)
+   [Karma homepage](http://karma-runner.github.com)
+   [CommonJS](http://www.commonjs.org/)
+   [Browserify](https://github.com/substack/node-browserify)