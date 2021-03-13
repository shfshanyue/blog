# Markdown Parser

## Remark


``` javascript
var unified = require('unified')
var parse = require('remark-parse')
var stringify = require('remark-stringify')

module.exports = unified()
  .use(parse)
  .use(stringify)
  .freeze()
```

## MDAST

## Remark Plugin

+ [Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins)

``` javascript
const behead = require('remark-behead')
const remark = require('remark')

remark()
  .use(behead, { after: 1, depth: 1 })
  .process([
    '# foo',
    '# bar',
    '# baz'
  ].join('\n'))
  .then(vfile => vfile.toString())
  .then(markdown => console.log(markdown))

// # foo
// ## bar
// ## baz
```

``` javascript
remark()
  .use(behead, { depth: 1 })
  .process([
    '# foo',
    '# bar',
    '# baz'
  ].join('\n'))
  .then(vfile => vfile.toString())
  .then(markdown => console.log(markdown))
```

``` javascript
const visit = require("unist-util-visit");

const beheadPlugin = (options) => {
  const depth = options.depth

  return function transformer(tree, vfile) {
    visit(tree, 'heading', (node) => {
      // 实际工作中注意边界
      node.depth += depth
    })
    return tree
  };
};
```

## To HTML

``` javascript
```
