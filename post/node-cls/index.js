const createNamespace = require('cls-hooked').createNamespace
ns = createNamespace('hello, world')
let userId

function getUser () {
  return ns.get('userId')
}

function middleware (id) {
  ns.run(async () => {
    console.log('middleware', id)
    ns.set('userId', id)
    await next()
  })
}

async function next () {
  await Promise.resolve()
  console.log('next:', getUser())
}

function main () {
  middleware(100)
  middleware(200)
  middleware(300)
}

main()
