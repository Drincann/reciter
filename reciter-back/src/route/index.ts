import Router from 'koa-router'
import { helloRouter } from './hello'
import { wordRouter } from './word'

export const router = new Router()

router.use('/api', helloRouter.routes()).use('/api', wordRouter.routes())
