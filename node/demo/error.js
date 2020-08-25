async function error () {
  throw new Error('hello, error')
}

error().catch(e => {
  console.log('hello, world')
  process.exitCode = 1
})

// process.on('unhandledRejection', e => {
//   console.error(e)
// })