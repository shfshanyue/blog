const world = require('./b')

const hello = () => {
  console.log('hello')
  world()
  return 'hello'
}

hello()

module.exports = hello
