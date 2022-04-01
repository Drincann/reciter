<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { ref } from 'vue'
import {
  Check,
  DArrowLeft,
  DArrowRight,
  Refresh,
  Remove,
  Edit,
} from '@element-plus/icons-vue'

const props: Readonly<{ word?: string; note?: string }> = defineProps([
  'word',
  'note',
  '_id',
  'nextTime',
])
const noteList = computed(() => props.note?.split('\n') || [])
const showDetails = ref(false)
const editWordFormVisibal = ref(false)
const form = ref({
  word: props.word,
  note: props.note,
})
function previousState() {}
function nextState() {}
function edit() {
  editWordFormVisibal.value = true
}
function remove() {}
function renewState() {}
</script>

<template>
  <el-card class="card">
    <el-row @click.stop="showDetails = !showDetails" class="word-box">
      <el-col :span="20">
        <span class="word">{{ props.word }}</span>
        <el-tag style="margin-left: 1rem" size="small">1s</el-tag>
      </el-col>
      <el-col :span="4" class="button-pass-box">
        <el-button
          type="success"
          :icon="Check"
          circle
          @click.stop
          size="large"
        />
      </el-col>
    </el-row>
    <hr v-show="showDetails" />

    <transition name="el-zoom-in-top">
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
              @click="edit"
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
        <el-button type="primary" @click="editWordFormVisibal = false"
          >修改</el-button
        >
      </span>
    </template>
  </el-dialog>
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
