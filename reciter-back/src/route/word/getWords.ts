import Koa from 'koa'
import { WordService } from '../../service'

export async function getWords(ctx: Koa.Context) {
  try {
    const { lastWord, user, count } = ctx.request.body as {
      lastWord: string
      user: string
      count?: number
    }
    // type check
    if (
      typeof lastWord !== 'string' ||
      typeof user !== 'string' ||
      (count != null && typeof count !== 'number')
    ) {
      ctx.throw(400, 'invalid request')
    }

    const ret = await WordService.getInstance().getWords({
      lastWord,
      user,
      count: count == undefined ? 20 : count,
    })
    ctx.body = {
      success: true,
      data: ret,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      ctx.throw(500, error.message)
    } else {
      ctx.throw(500, 'unknown error')
    }
  }
}
