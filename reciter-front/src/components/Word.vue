<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { ref } from 'vue'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'

import {
  Check,
  DArrowLeft,
  DArrowRight,
  Refresh,
  Remove,
  Edit,
} from '@element-plus/icons-vue'
import axios from 'axios'

const props: Readonly<{
  word?: string
  note?: string
  _id?: string
  nextTime?: number
  show?: boolean
}> = defineProps(['word', 'note', '_id', 'nextTime', 'show'])
const emit = defineEmits(['wordPassed', 'wordRemoved', 'wordEdited'])

const noteList = computed(() => props.note?.split('\n') || [])
const showDetails = ref(false)
const editWordFormVisibal = ref(false)
const form = ref({
  word: props.word,
  note: props.note,
})
const tobeUpdate = ref(false)
const updateWord = ref(() => {
  /* */
})
const currTime = ref(moment())
const isNotTimeToReview = computed((): boolean => {
  return currTime.value.isBefore(moment(props.nextTime))
})
const timeToReviewText = computed((): string => {
  return moment(props.nextTime).from(currTime.value)
})

setInterval(() => {
  currTime.value = moment()
}, 1000)

async function previousState() {
  const ret = await axios.post('/api/movePrevWordState', {
    word: props.word,
    user: 'test',
  })

  if (ret.data.success) {
    tobeUpdate.value = true
    updateWord.value = () => {
      emit('wordPassed', props._id, ret.data.data)
    }
  }
}
async function nextState() {
  const ret = await axios.post('/api/moveNextWordState', {
    user: 'test',
    word: props.word,
  })
  if (ret.data.success) {
    tobeUpdate.value = true
    updateWord.value = () => {
      emit('wordPassed', props._id, ret.data.data)
    }
  }
}

async function passWord() {
  const ret = await axios.post('/api/moveNextWordState', {
    user: 'test',
    word: props.word,
  })
  if (ret.data.success) {
    emit('wordPassed', props._id, ret.data.data)
  }
}

async function editWord() {
  const { word: newWord, note: newNote } = form.value
  if (!newWord || !newNote) {
    return
  }
  const ret = await axios.post('/api/updateWord', {
    word: props.word,
    user: 'test',
    newWord,
    newNote,
  })

  if (ret.data.success) {
    tobeUpdate.value = true
    updateWord.value = () => {
      emit('wordEdited', props._id, ret.data.data)
    }
    editWordFormVisibal.value = false
  }
}
async function remove() {
  const ret = await axios.post('/api/deleteWord', {
    user: 'test',
    word: props.word,
  })
  if (ret.data.success) {
    tobeUpdate.value = true
    updateWord.value = () => {
      emit('wordRemoved', props._id)
    }
  }
}
async function renewState() {
  const ret = await axios.post('/api/renewWordState', {
    user: 'test',
    word: props.word,
  })
  if (ret.data.success) {
    tobeUpdate.value = true
    updateWord.value = () => {
      emit('wordPassed', props._id, ret.data.data)
    }
  }
}
async function onSlideUpDetails() {
  if (tobeUpdate.value) {
    tobeUpdate.value = false
    updateWord.value()
  }
}
</script>

<template>
  <div>
    <transition name="el-zoom-in-top">
      <el-card class="card" v-show="props.show">
        <el-row @click.stop="showDetails = !showDetails" class="word-box">
          <el-col :span="20">
            <span class="word"
              >{{ props.word }}
              <el-tag style="margin-left: 1rem" size="small">{{
                timeToReviewText
              }}</el-tag></span
            >
          </el-col>
          <el-col :span="4" class="button-pass-box">
            <el-button
              type="success"
              :icon="Check"
              :disabled="isNotTimeToReview"
              circle
              @click.stop="passWord"
              size="large"
            />
          </el-col>
        </el-row>
        <hr v-show="showDetails" />
        <transition name="el-zoom-in-top" @after-leave="onSlideUpDetails">
          <div v-show="showDetails" class="card-details">
            <el-row v-for="(note, index) in noteList" :key="index"
              >- {{ note }}
            </el-row>
            <el-row class="card-details-controls">
              <el-col>
                <el-button
                  circle
                  :icon="DArrowLeft"
                  type="primary"
                  @click="previousState"
                ></el-button>
                <el-button
                  circle
                  :icon="DArrowRight"
                  type="primary"
                  @click="nextState"
                ></el-button>
                <el-button
                  circle
                  :icon="Refresh"
                  type="warning"
                  @click="renewState"
                ></el-button>
                <el-button
                  circle
                  :icon="Edit"
                  type="info"
                  @click="editWordFormVisibal = true"
                ></el-button>
                <el-button
                  circle
                  :icon="Remove"
                  type="danger"
                  @click="remove"
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </transition>
      </el-card>
    </transition>

    <!-- 修改 word -->
    <el-dialog v-model="editWordFormVisibal" title="修改单词">
      <el-form :model="form">
        <el-form-item label="Word"
          ><el-input v-model.trim="form.word" placeholder="单词" />
        </el-form-item>
        <el-form-item label="Note">
          <el-input
            type="textarea"
            v-model="form.note"
            placeholder="翻译、例句、笔记等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editWordFormVisibal = false">取消</el-button>
          <el-button type="primary" @click="editWord">修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-details-controls {
  margin-top: 1rem;
  text-align: right;
}

.button-pass-box {
  text-align: right;
}

.word {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 2rem;
  font-weight: bold;
}

.word-box {
  cursor: pointer;
}
</style>
