const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'hello, world'
})

app.listen(3200, () => console.log('Port: 3200'))
