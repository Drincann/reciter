import Koa from 'koa'
import { WordService } from '../../service'
export async function addWord(ctx: Koa.Context) {
  try {
    const { user, word, note } = ctx.request.body as {
      user: string
      word: string
      note: string
    }
    // type check
    if (
      typeof user !== 'string' ||
      typeof word !== 'string' ||
      typeof note !== 'string'
    ) {
      ctx.throw(400, 'invalid request')
    }

    const wordService = WordService.getInstance()
    if (await wordService.isWordExist({ user, word })) {
      ctx.body = {
        success: false,
        data: null,
        msg: '单词已存在',
      }
      return
    }

    const ret = await wordService.addWord({
      user,
      word,
      note,
    })

    if (ret != null) {
      ctx.body = {
        success: true,
        data: ret,
        msg: '添加成功',
      }
    } else {
      ctx.body = {
        success: false,
        data: null,
        msg: '添加失败',
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
