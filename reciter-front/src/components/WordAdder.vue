<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
const addWordFormVisibal = ref(false)
const form = ref({
  word: '',
  note: '',
})
function addWord() {
  console.log(form.value)
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
        <el-button type="primary" @click="addWordFormVisibal = false"
          >添加</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
