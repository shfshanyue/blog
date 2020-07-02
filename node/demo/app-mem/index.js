const Koa = require('koa')
const app = new Koa()

const data = Array.from(Array(1000)).map(x => 10086)

app.use(async (ctx, next) => {
  ctx.data = data
  await next()
})

app.use(ctx => {
  ctx.body = 'hello, world'
})

app.listen(3200, () => console.log('Port: 3200'))
