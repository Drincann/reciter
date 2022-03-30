import Router from 'koa-router'

export const helloRouter = new Router()

helloRouter
    .get('/hello', async ctx => {
        ctx.body = 'hello'
    })