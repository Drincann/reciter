import Router from 'koa-router'
import { helloRouter } from './hello'

export const router = new Router()

router.use('/api', helloRouter.routes())