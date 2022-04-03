import Koa from 'koa'
import { WordService } from '../../service'

export async function updateWord(ctx: Koa.Context) {
  try {
    const { user, word, newWord, newNote } = ctx.request.body as {
      user: string
      word: string
      newWord: string
      newNote: string
    }
    // type check
    if (typeof user !== 'string' || typeof word !== 'string') {
      ctx.throw(400, 'invalid request')
    }

    const wordService = WordService.getInstance()

    const ret = await wordService.updateWord({
      user,
      word,
      newWord,
      newNote,
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
