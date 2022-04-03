import Koa from 'koa'
import { WordService } from '../../service'
export async function deleteWord(ctx: Koa.Context) {
  try {
    const { user, word } = ctx.request.body as {
      user?: string
      word?: string
    }
    // type check
    if (typeof user !== 'string' || typeof word !== 'string') {
      ctx.throw(400, 'invalid request')
    }

    const wordService = WordService.getInstance()

    const ret = await wordService.deleteWord({
      user,
      word,
    })

    if (ret) {
      ctx.body = {
        success: true,
        data: ret,
        msg: '删除成功',
      }
    } else {
      ctx.body = {
        success: false,
        data: null,
        msg: '删除失败',
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
