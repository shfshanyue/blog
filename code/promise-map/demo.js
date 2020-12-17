const Bluebird = require('bluebird')

function get (i) {
  console.log('In ', i)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i * 1000) 
      console.log('Out', i, 'Out')
    }, i * 1000)
  })
}

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// get().then(o => console.log('done'))
// get().then(o => console.log('done'))
// get().then(o => console.log('done'))
// get().then(o => console.log('done'))

// let count = 0
// function run () {
//   if (count < 3 && list.length) {
//     count+=1
//     get(list.shift()).then(() => {
//       count-=1 
//       run()
//     })
//   }
// }

// run()
// run()
// run()

// Promise.map = function(list, f, { concurrency }) {
//   for (let i=0; i<concurrency; i++) {
//     f() 
//   }
// }


// Bluebird.map(list, x => {
//   return get(x)
// }, {
//   concurrency: 3
// })


class Limit {
  constructor (n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }

  enqueue (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }

  dequeue () {
    if (this.count < this.limit && this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve).catch(reject)
    }
  }

  async run (fn) {
    this.count++
    const value = await fn()
    this.count--
    this.dequeue()
    return value
  }

  build (fn) {
    if (this.count < this.limit) {
      return this.run(fn)
    } else {
      return this.enqueue(fn)
    }
  }
}

PromiseMap = function (list, fn, { concurrency }) {
  const limit = new Limit(concurrency)
  return Promise.all(list.map((...args) => {
    return limit.build(() => fn(...args))
  }))
}

// const limit = require('promise-limit')(3)
// Promise.all(list.map((i) => {
//   return limit(() => get(i))
// })).then(results => {
//   console.log(results)
// })



// const l = new Limit(3)
// Promise.all(list.map(i => {
//   return l.build(() => get(i))
// })).then(results => {
//   console.log(results)
// })

PromiseMap(list, i => get(i), { concurrency: 3 })
