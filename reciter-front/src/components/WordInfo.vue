<script setup lang="ts">
defineProps(['needReviewCount', 'totalCount'])
</script>
<template>
  <el-descriptions border>
    <el-descriptions-item label="还需复习">
      {{ needReviewCount }}</el-descriptions-item
    >

    <el-descriptions-item label="总单词计划">{{
      totalCount
    }}</el-descriptions-item>
  </el-descriptions>
</template>
