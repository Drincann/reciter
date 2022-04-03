import Router from 'koa-router'
import { addWord } from './addWord'
import { deleteWord } from './deleteWord'
import { getWords } from './getWords'
import { moveNextWordState } from './moveNextWordState'
import { movePrevWordState } from './movePrevWordState'
import { renewWordState } from './renewWrodState'
import { updateWord } from './updateWord'
export const wordRouter = new Router()

wordRouter
  .post('/getWords', getWords)
  .post('/addWord', addWord)
  .post('/deleteWord', deleteWord)
  .post('/updateWord', updateWord)
  .post('/moveNextWordState', moveNextWordState)
  .post('/movePrevWordState', movePrevWordState)
  .post('/renewWordState', renewWordState)
