# 在 Node 中 require 时发生了什么

``` js
const fs = require('fs')

const _ = require('lodash')
```

## 

``` js
(function(exports, require, module, __filename, __dirname) {
  // 所有的模块代码都被包裹在这个函数中
});
```

``` js
Module.require (<node_internals>/internal/modules/cjs/loader.js:1019)
require (<node_internals>/internal/modules/cjs/helpers.js:72)
<anonymous> (/root/Documents/blog/node/demo/require/index.js:1)
Module._compile (<node_internals>/internal/modules/cjs/loader.js:1138)
Module._extensions..js (<node_internals>/internal/modules/cjs/loader.js:1158)
Module.load (<node_internals>/internal/modules/cjs/loader.js:986)
Module._load (<node_internals>/internal/modules/cjs/loader.js:879)
executeUserEntryPoint (<node_internals>/internal/modules/run_main.js:71)
<anonymous> (<node_internals>/internal/main/run_main_module.js:17)
```

``` js
// <node_internals>/internal/modules/cjs/loader.js:1019

Module.prototype.require = function(id) {
  validateString(id, 'id');
  if (id === '') {
    throw new ERR_INVALID_ARG_VALUE('id', id,
                                    'must be a non-empty string');
  }
  requireDepth++;
  try {
    return Module._load(id, this, /* isMain */ false);
  } finally {
    requireDepth--;
  }
}
```

``` js
Module._load = function(request, parent, isMain) {
  let relResolveCacheIdentifier;
  if (parent) {
    // ...
  }

  const filename = Module._resolveFilename(request, parent, isMain);

  const cachedModule = Module._cache[filename];
  if (cachedModule !== undefined) {
    updateChildren(parent, cachedModule, true);
    return cachedModule.exports;
  }

  const mod = loadNativeModule(filename, request);
  if (mod && mod.canBeRequiredByUsers) return mod.exports;

  // Don't call updateChildren(), Module constructor already does.
  const module = new Module(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }

  Module._cache[filename] = module;
  if (parent !== undefined) {
    relativeResolveCache[relResolveCacheIdentifier] = filename;
  }

  let threw = true;
  try {
    // Intercept exceptions that occur during the first tick and rekey them
    // on error instance rather than module instance (which will immediately be
    // garbage collected).
    if (enableSourceMaps) {
      try {
        module.load(filename);
      } catch (err) {
        rekeySourceMap(Module._cache[filename], err);
        throw err; /* node-do-not-add-exception-line */
      }
    } else {
      module.load(filename);
    }
    threw = false;
  } finally {
    if (threw) {
      delete Module._cache[filename];
      if (parent !== undefined) {
        delete relativeResolveCache[relResolveCacheIdentifier];
        const children = parent && parent.children;
        if (ArrayIsArray(children)) {
          const index = children.indexOf(module);
          if (index !== -1) {
            children.splice(index, 1);
          }
        }
      }
    }
  }

  return module.exports;
};
```