function sum (a, b) {
  return a + b
}

function sub (a, b) {
  return a - b
}

function nestCompute () {
  const a = sub(sum(1, 3), 5)
  return a * 100
}

function mapSum () {
  return [1, 2, 3, 4, 5].map(x => sum(x, 1)).filter(x => x > 3)
}

async function asyncSum (a, b) {
  return a + b
}

function error () {
  throw new Error('hello, error')
}

function reject () {
  return Promise.reject('hello, reject')
}

// console.log(nestCompute())
// console.log(mapSum())
// asyncSum()
// error()
// reject().catch(e => console.log(e))

// process.on('unhandledRejection', e => console.trace(e))

// function sleep () {
//   return new Promise(resolve => {
//     setTimeout(resolve, 3000)
//   })
// }

// async function main () {
//   await sum(3, 4)
//   await asyncSum(3, 4)
//   console.log('hello, world')
// }


// main()
Promise.resolve(3).then(o => {
  console.log(o)
})

console.log('hello, world')
