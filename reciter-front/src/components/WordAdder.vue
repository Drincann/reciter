<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import axios from 'axios'
const emit = defineEmits(['wordAdded'])
const addWordFormVisibal = ref(false)
const form = ref({
  word: '',
  note: '',
})
async function addWord() {
  const { word, note } = form.value
  const user = 'test'
  if (!word) {
    return
  }
  const ret = await axios.post('/api/addWord', { word, note, user })
  if (ret.data.success) {
    form.value = {
      word: '',
      note: '',
    }
    addWordFormVisibal.value = false
    emit('wordAdded', ret.data.data)
  }
}
</script>

<template>
  <el-button
    :icon="Plus"
    type="success"
    plain
    @click.stop="addWordFormVisibal = true"
  ></el-button>

  <el-dialog v-model="addWordFormVisibal" title="添加单词">
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
        <el-button @click="addWordFormVisibal = false">取消</el-button>
        <el-button type="primary" @click="addWord">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style>
.el-button {
  height: 100%;
}
</style>
