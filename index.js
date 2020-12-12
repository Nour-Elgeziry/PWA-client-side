
/* index.js */

import Koa from 'koa'
import https from 'https'

const app = new Koa()

const defaultPort = 8080
const port = process.env.PORT || defaultPort

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
