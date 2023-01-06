const __custompack_module__ = {
  "./module1.js": function(require, exports) {
    eval(`"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.a = void 0;
var _module = require("./module2.js");
console.log('b', _module.b);
var a = 1;
exports.a = a;`)
  },"./module2.js": function(require, exports) {
    eval(`"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.b = void 0;
var b = 2;
exports.b = b;`)
  },"/Users/jinyan/Desktop/projects/webpack-test/template/entry.js": function(require, exports) {
    eval(`"use strict";

var _module = require("./module1.js");
console.log('a', _module.a);`)
  }
}

const __custompack_exports_cache__ = {}

function __custompack_require__(moduleName) {
  if (__custompack_exports_cache__[moduleName]) {
    return __custompack_exports_cache__[moduleName]
  }

  __custompack_exports_cache__[moduleName] = {
    exports: {}
  }

  const moduleContent = __custompack_module__[moduleName]
  moduleContent(__custompack_require__, __custompack_exports_cache__[moduleName].exports)

  return __custompack_exports_cache__[moduleName].exports
}

__custompack_require__('/Users/jinyan/Desktop/projects/webpack-test/template/entry.js')
    