let userId

function getUser () {
  return userId
}

async function middleware (id) {
  console.log('middleware', id)
  userId = id
  await next()
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
