<script setup lang="ts">
import Word from './components/Word.vue'
</script>

<template>
  <el-container>
    <el-header>header</el-header>
    <el-main class="main">
      <Word></Word>
    </el-main>
  </el-container>
</template>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

* {
  border: dashed 1px var(--el-border-color);
}
</style>
