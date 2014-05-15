describe('client', function() {

	beforeEach(function(){
		window.__cjs_module__ = {};
		window.__cjs_modules_root__ = '/root';
	});

	it('should correctly resolve modules with circular dependencies issue #6', function(){

		 window.__cjs_module__['/foo.js'] = function(require, module, exports) {
		 	var bar = require('./bar');
		 	exports.txt = 'foo';
		 	exports.getText = function() {
		 		return 'foo ' + bar.txt;
		 	};		 	
		 };

		 window.__cjs_module__['/bar.js'] = function(require, module, exports) {
		 	var foo = require('./foo');
		 	exports.txt = 'bar';
		 	exports.getText = function() {
		 		return 'bar ' + foo.txt;
		 	}
		 };		

		expect(require('/app.js', './foo').getText()).toEqual('foo bar');
		expect(require('/app.js', './bar').getText()).toEqual('bar foo');
	});

  describe('resolving of index files for both JS and CoffeeScript', function () {

    it('should resolve paths like "./foo" to "./foo/Index.js" if foo.js does not exist', function () {

      window.__cjs_module__['/foo/Index.js'] = function(require, module, exports) {
        exports.message = 'hello from Index.js';
      };

      expect(require('/', './foo').message).toEqual('hello from Index.js');
    });

    it('should resolve paths like "./foo" to "./foo/index.js" if foo.js does not exist', function () {

      window.__cjs_module__['/foo/index.js'] = function(require, module, exports) {
        exports.message = 'hello from index.js';
      };

      expect(require('/', './foo').message).toEqual('hello from index.js');
    });

    it('should resolve paths like "./foo" to "./foo/Index.coffee" if foo.js / foo.coffee does not exist', function () {

      window.__cjs_module__['/foo/Index.coffee'] = function(require, module, exports) {
        exports.message = 'hello from Index.coffee';
      };

      expect(require('/', './foo').message).toEqual('hello from Index.coffee');
    });

    it('should resolve paths like "./foo" to "./foo/index.coffee" if foo.js / foo.coffee does not exist', function () {

      window.__cjs_module__['/foo/index.coffee'] = function(require, module, exports) {
        exports.message = 'hello from index.coffee';
      };

      expect(require('/', './foo').message).toEqual('hello from index.coffee');
    });

    it('should resolve JS files first in paths like "./foo" if foo.js / foo.coffee does not exist', function () {

      window.__cjs_module__['/foo/index.js'] = function(require, module, exports) {
        exports.message = 'hello from index.js';
      };

      window.__cjs_module__['/foo/index.coffee'] = function(require, module, exports) {
        exports.message = 'hello from index.coffee';
      };

      expect(require('/', './foo').message).toEqual('hello from index.js');
    });

  });

	describe('path resolving and normalization', function(){

		it('should properly resolve full paths', function(){
			expect(normalizePath('/base/foo.js', '/home/bar.js')).toEqual('/home/bar.js');
		});

		it('should properly resolve relative paths starting with .', function(){
			expect(normalizePath('/base/foo.js', './bar.js')).toEqual('/base/bar.js');
		});

		it('should properly resolve relative paths starting with ..', function(){
			expect(normalizePath('/base/sub/foo.js', '../bar.js')).toEqual('/base/bar.js');
		});

		it('should add .js suffix if necessary', function(){
			expect(normalizePath('/foo.js', './bar')).toEqual('/bar.js');
		});

		it('should properly handle .. and . inside paths', function(){
			expect(normalizePath('/base/sub/foo.js', './other/../../sub2/./bar.js')).toEqual('/base/sub2/bar.js');
		});

		it('should resolve paths without qualifiers as relative to a defined root', function(){
			expect(normalizePath('/base/foo.js', 'bar', '/my/root')).toEqual('/my/root/bar.js');
		});

	});
});