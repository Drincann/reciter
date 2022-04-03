<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue'
import Searcher from './components/Searcher.vue'
import Word from './components/Word.vue'
import WordAdder from './components/WordAdder.vue'
import WordInfo from './components/WordInfo.vue'
import axios from 'axios'
interface WordViewData {
  _id: string
  word: string
  note: string
  nextTime: number
  show: boolean
}

interface WordRawData {
  _id: string // id
  word: string // 单词
  note: string // 翻译、例句、笔记等
  startTime: number // 首次背诵时间
  reviewState: number // 当前背诵阶段
  nextTime: number // 下次背诵时间
  user: string // 用户名，区分用户
}

interface WordInfoData {
  needReviewCount: number
  totalCount: number
}

const wordInfoData: Ref<WordInfoData> = ref({
  needReviewCount: 0,
  totalCount: 0,
})

const words: Ref<WordViewData[]> = ref([])
function sortWords() {
  words.value = words.value.sort((a, b) => {
    return a.nextTime - b.nextTime
  })
}
async function loadWords() {
  let res = await axios.post('/api/getWords', {
    user: 'test',
    lastWord:
      words.value.length === 0 ? '' : words.value[words.value.length - 1].word,
    count: 12,
  })

  ;(res.data.data as Array<WordRawData>).forEach((word: WordRawData, index) => {
    words.value.push({
      _id: word._id,
      word: word.word,
      note: word.note,
      nextTime: word.nextTime,
      show: false,
    })
  })
  sortWords()
  nextTick(() => {
    words.value.forEach((word) => (word.show = true))
  })
}

async function newWordAdded(word: WordRawData) {
  words.value.push({
    _id: word._id,
    word: word.word,
    note: word.note,
    nextTime: word.nextTime,
    show: false,
  })
  const currWord = words.value[words.value.length - 1]
  nextTick(() => {
    currWord.show = true
  })
  sortWords()
}

async function wordEdited(_id: string, newWord: WordRawData) {
  const index = words.value.findIndex((word) => word._id === _id)

  if (index === -1) {
    return
  }
  words.value[index].word = newWord.word
  words.value[index].note = newWord.note
  sortWords()
}
async function wordPassed(_id: string, newWord: WordRawData) {
  const index = words.value.findIndex((word) => word._id === _id)

  if (index === -1) {
    return
  }
  words.value[index].nextTime = newWord.nextTime
  sortWords()
}
async function wordRemoved(_id: string) {
  const index = words.value.findIndex((word) => word._id === _id)

  if (index === -1) {
    return
  }
  words.value[index].show = false
  words.value.splice(index, 1)
  console.log(words.value)
}
</script>

<template>
  <el-scrollbar always> </el-scrollbar>
  <div v-infinite-scroll="loadWords"></div>

  <el-backtop :right="30" :bottom="80" />
  <el-container>
    <el-header :gutter="10">
      <el-row>
        <Searcher></Searcher>
      </el-row>
      <el-row>
        <el-col :span="18">
          <WordInfo v-bind="wordInfoData"></WordInfo>
        </el-col>
        <el-col :span="2" :offset="2">
          <WordAdder @word-added="newWordAdded"></WordAdder>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="main">
      <Word
        v-bind="word"
        @word-removed="wordRemoved"
        @word-passed="wordPassed"
        @word-edited="wordEdited"
        class="word-box"
        v-for="(word, index) in words"
        :key="index"
      ></Word>
    </el-main>
  </el-container>
</template>

<style>
#app {
  max-width: 40rem;
  margin: 0 auto;
  /* padding: 1rem; */
  /* font-weight: normal; */
}

.el-header {
  padding: 1rem;
  height: auto;
}

.el-header > * {
  margin-bottom: 1rem;
}

.el-header > *:last-child {
  margin-bottom: 0;
}

.el-main {
  padding: 0;
}

.el-card__body {
  padding: 1rem 2rem;
  /* transition: all 0.5s; */
}

.el-card {
  margin-bottom: 1rem;
}

.word-box:last-child {
  margin-bottom: 10rem;
}

* {
  /* border: dashed 1px var(--el-border-color); */
}
</style>
