<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
const searchStr = ref('')

const InputEle = ref<HTMLInputElement | null>(null)

let showInput = ref(false)
let showSearchButton = ref(true)
</script>

<template>
  <Transition name="el-zoom-in-center" @after-leave="showSearchButton = true">
    <el-col :span="24" v-show="showInput">
      <el-input
        v-model="searchStr"
        v-on:focusout="showInput = false"
        placeholder="Search you input"
        ref="InputEle"
      />
    </el-col>
  </Transition>
  <el-col :span="11"></el-col>

  <Transition
    name="el-zoom-in-center"
    @after-leave=";(showInput = true), InputEle?.focus()"
  >
    <el-col :span="2" v-show="showSearchButton">
      <el-button
        class="search-button"
        :icon="Search"
        type="info"
        circle
        @click="showSearchButton = false"
      >
      </el-button>
    </el-col>
  </Transition>
</template>

<style>
.search-button {
  transition: all 0.3s ease-in-out;
}
</style>
