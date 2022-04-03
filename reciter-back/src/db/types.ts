import { ObjectId } from 'bson'
import { Collection } from 'mongodb'

export interface WordDocument {
  _id?: ObjectId // id
  word: string // 单词
  note: string // 翻译、例句、笔记等
  startTime: number // 首次背诵时间
  reviewState: ReviewState // 当前背诵阶段
  nextTime: number // 下次背诵时间
  user: string // 用户名，区分用户
}

export type WordCollection = Collection<WordDocument>

export enum ReviewState {
  stage1, // 5 分钟
  stage2, // 30 分钟
  stage3, // 12小时
  stage4, // 1 天
  stage5, // 2 天
  stage6, // 4 天
  stage7, // 7 天
  stage8, // 15 天
  stage9, // 1 个月
  stage10, // 3 个月
  stage11, // 6 个月
}

export function nextStateCalculator({
  reviewState,
}: {
  reviewState: ReviewState
}) {
  return reviewState + 1
}

export function prevStateCalculator({
  reviewState,
}: {
  reviewState: ReviewState
}) {
  return reviewState - 1 < 0 ? ReviewState.stage1 : reviewState - 1
}

export function renewStateCalculator({
  reviewState,
}: {
  reviewState: ReviewState
}) {
  return ReviewState.stage1
}

export function nextTimeCalculator({
  reviewState,
  startTime,
}: {
  reviewState: ReviewState
  startTime: number
}) {
  switch (reviewState) {
    case ReviewState.stage1:
      return startTime + 5 * 60 * 1000
    case ReviewState.stage2:
      return startTime + 30 * 60 * 1000
    case ReviewState.stage3:
      return startTime + 12 * 60 * 60 * 1000
    case ReviewState.stage4:
      return startTime + 24 * 60 * 60 * 1000
    case ReviewState.stage5:
      return startTime + 2 * 24 * 60 * 60 * 1000
    case ReviewState.stage6:
      return startTime + 4 * 24 * 60 * 60 * 1000
    case ReviewState.stage7:
      return startTime + 7 * 24 * 60 * 60 * 1000
    case ReviewState.stage8:
      return startTime + 15 * 24 * 60 * 60 * 1000
    case ReviewState.stage9:
      return startTime + 30 * 24 * 60 * 60 * 1000
    case ReviewState.stage10:
      return startTime + 3 * 30 * 24 * 60 * 60 * 1000
    case ReviewState.stage11:
      return startTime + 6 * 30 * 24 * 60 * 60 * 1000
    default:
      // 加三个月
      return (
        startTime +
        6 * 30 * 24 * 60 * 60 * 1000 +
        (reviewState - ReviewState.stage11) * 3 * 30 * 24 * 60 * 60 * 1000
      )
  }
}
