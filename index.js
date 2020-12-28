
/* index.js */


import https from 'https'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import views from 'koa-views'
import fs from 'fs-extra'


const app = new Koa()
const router = new Router()

const defaultPort = 8080
const port = process.env.PORT || defaultPort



app.use(serve('.'))

app.use(views('.'))


router.get('/', async ctx => {
	
	await ctx.render('index.html')
})

app.use(router.routes())

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

