import Koa from 'koa'
import { config } from './config'
import { router } from './route'
import serve from 'koa-static'
// body
import bodyParser from 'koa-bodyparser'

const app = new Koa()

app
  .use(bodyParser())

  .use(router.routes())

  .use(serve(config.staticRoot))

  .listen(config.port)
