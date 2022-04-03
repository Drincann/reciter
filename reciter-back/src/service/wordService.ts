import { UpdateResult } from 'mongodb'
import { config } from '../config'
import { wordCollection } from '../db'
import {
  nextTimeCalculator,
  WordCollection,
  WordDocument,
  ReviewState,
  nextStateCalculator,
  prevStateCalculator,
  renewStateCalculator,
} from '../db/types'

export enum StateUpdateTo {
  NEXT,
  PREV,
  RENEW,
}
export class WordService {
  private constructor() {
    // ignore
  }
  private wordCollection: WordCollection = wordCollection
  private static single: WordService | null = null
  static getInstance(): WordService {
    if (WordService.single === null) {
      WordService.single = new WordService()
    }
    return WordService.single
  }
  private userWordsMap: Map<string, WordDocument[]> = new Map()

  public async isWordExist({
    word,
    user,
  }: {
    word: string
    user: string
  }): Promise<boolean> {
    const ret = await this.wordCollection.findOne({
      user,
      word,
    })
    return ret != null
  }

  // 添加单词
  async addWord({
    word,
    note,
    user,
  }: {
    word: string
    note: string
    user: string
  }): Promise<WordDocument | null> {
    const startTime = Date.now()
    const nextTime = nextTimeCalculator({
      startTime: startTime,
      reviewState: ReviewState.stage1,
    })

    const ret = await this.wordCollection.insertOne({
      user,
      word,
      note,
      startTime,
      nextTime,
      reviewState: ReviewState.stage1,
    })
    if (ret.acknowledged) {
      if (this.userWordsMap.has(user)) {
        this.userWordsMap.delete(user)
      }
      return {
        _id: ret.insertedId,
        user,
        word,
        note,
        startTime,
        nextTime,
        reviewState: ReviewState.stage1,
      }
    }
    return null
  }

  // 删除单词
  async deleteWord({
    word,
    user,
  }: {
    word: string
    user: string
  }): Promise<boolean> {
    const ret = await this.wordCollection.deleteOne({
      user,
      word,
    })
    if (ret.acknowledged) {
      if (this.userWordsMap.has(user)) {
        this.userWordsMap.delete(user)
      }
      return true
    }
    return false
  }
  // 修改单词
  public async updateWord({
    word,
    user,
    newWord,
    newNote,
  }: {
    word: string
    user: string
    newWord?: string
    newNote?: string
  }): Promise<WordDocument | null> {
    if (newWord === undefined && newNote === undefined) {
      return await wordCollection.findOne({ word, user })
    }
    const updater: { word?: string; note?: string } = {}
    if (newWord != null) {
      updater.word = newWord
    }

    if (newNote != null) {
      updater.note = newNote
    }

    const ret = await this.wordCollection.updateOne(
      { user, word },
      {
        $set: updater,
      }
    )

    if (ret.acknowledged) {
      if (this.userWordsMap.has(user)) {
        this.userWordsMap.delete(user)
      }
      return await wordCollection.findOne({ word, user })
    }
    return null
  }

  // 获取单词
  public async getWords({
    user,
    lastWord,
    count,
  }: {
    user: string
    lastWord: string
    count: number
  }): Promise<WordDocument[]> {
    if (!this.userWordsMap.has(user)) {
      // 载入缓存
      this.userWordsMap.set(
        user,
        (await this.wordCollection.find({ user }).toArray()).sort(
          // 按照 nextTime 从小到大排序
          (l, r) => l.nextTime - r.nextTime
        )
      )
      setTimeout(() => {
        this.userWordsMap.delete(user)
      }, config.wordCacheTime)
    }
    if (this.userWordsMap.get(user)?.length === 0) {
      return []
    }

    const words: WordDocument[] = this.userWordsMap.get(user) as WordDocument[]

    const lastWordIndex = words.findIndex((v) => v.word === lastWord)
    if (lastWordIndex > -1) {
      count = Math.min(count, words.length - lastWordIndex - 1)
      return words.slice(lastWordIndex + 1, lastWordIndex + count + 1)
    } else {
      return words.slice(0, count)
    }
  }

  public async updateWordState({
    word,
    user,
    updateTo,
  }: {
    word: string
    user: string
    updateTo: StateUpdateTo
  }): Promise<WordDocument | null> {
    const wordDoc = await this.wordCollection.findOne({
      user,
      word,
    })

    if (wordDoc === null) {
      return null
    }

    let ret: UpdateResult | null = null
    let nextState = null
    let nextTime = null
    switch (updateTo) {
      case StateUpdateTo.NEXT:
        nextState = nextStateCalculator({
          reviewState: wordDoc.reviewState,
        })
        break

      case StateUpdateTo.PREV:
        nextState = prevStateCalculator({
          reviewState: wordDoc.reviewState,
        })
        break
      case StateUpdateTo.RENEW:
        nextState = ReviewState.stage1
        break

      default:
        return null
    }
    nextTime = nextTimeCalculator({
      reviewState: nextState,
      startTime: wordDoc.startTime,
    })
    ret = await this.wordCollection.updateOne(
      { user, word },
      {
        $set: {
          reviewState: nextState,
          nextTime: nextTime,
        },
      }
    )
    if (ret?.acknowledged) {
      if (this.userWordsMap.has(user)) {
        this.userWordsMap.delete(user)
      }
      return await this.wordCollection.findOne({ user, word })
    }
    return null
  }
}
