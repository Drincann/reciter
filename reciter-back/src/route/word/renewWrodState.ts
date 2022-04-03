import Koa from 'koa'
import { WordService } from '../../service'
import { StateUpdateTo } from '../../service/wordService'

export async function renewWordState(ctx: Koa.Context) {
  try {
    const { user, word } = ctx.request.body as {
      user: string
      word: string
    }
    // type check
    if (typeof user !== 'string' || typeof word !== 'string') {
      ctx.throw(400, 'invalid request')
    }

    const wordService = WordService.getInstance()

    const ret = await wordService.updateWordState({
      user,
      word,
      updateTo: StateUpdateTo.RENEW,
    })

    if (ret) {
      ctx.body = {
        success: true,
        data: ret,
        msg: '更新成功',
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      ctx.throw(500, error.message)
    } else {
      ctx.throw(500, 'unknown error')
    }
  }
}
