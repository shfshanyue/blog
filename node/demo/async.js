const fs = require('fs')
const async_hooks = require('async_hooks')

function log (...args) {
  fs.writeSync(1, args.join(' ') + '\n')
}

async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    log('Init: ', `${type}(asyncId=${asyncId}, parentAsyncId: ${triggerAsyncId})`)
  },
  before(asyncId) {
    log('Before: ', asyncId)
  },
  after(asyncId) {
    log('After: ', asyncId)
  },
  destroy(asyncId) {
    log('Destory: ', asyncId);
  }
}).enable()

setTimeout(() => {
  // after 生命周期在回调函数最前边
  console.log('Async Before')
  Promise.resolve()
  Promise.resolve()
  Promise.resolve()
  // after 生命周期在回调函数最后边
  console.log('Async After')
})