import Koa from 'koa'
import { config } from './config'
import { router } from './route'
import serve from 'koa-static'

const app = new Koa()

app
    .use(router.routes())

    .use(serve(config.staticRoot))

    .listen(config.port)





