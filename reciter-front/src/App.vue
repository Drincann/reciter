<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Searcher from './components/Searcher.vue'
import Word from './components/Word.vue'
import WordAdder from './components/WordAdder.vue'
import WordInfo from './components/WordInfo.vue'
interface WordData {
  _id: string
  word: string
  note: string
  nextTime: number
}

interface WordInfoData {
  needReviewCount: number
  totalCount: number
}

const wordInfoData: Ref<WordInfoData> = ref({
  needReviewCount: 0,
  totalCount: 0,
})
const words: Ref<WordData[]> = ref([
  { _id: '1', word: 'abandon', note: ref('放弃\n泛起'), nextTime: Date.now() },
  { _id: '2', word: 'baby', note: ref('婴儿'), nextTime: Date.now() },
  { _id: '2', word: 'last', note: ref('婴儿'), nextTime: Date.now() },
])

function loadWords() {
  words.value.push(words.value[0])
}
</script>

<template>
  <el-scrollbar always="true"> </el-scrollbar>
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
          <WordAdder></WordAdder>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="main">
      <Word
        class="word-box"
        v-bind="word"
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
