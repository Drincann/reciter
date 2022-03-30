<script setup lang="ts">
import { reactive as r } from 'vue'

const state = r({ count: 0 })
function inc() {
  state.count++
}

</script>

<template>
    <el-card>
        <template #header>
            <el-row>
                <el-col :span="8">
                    <span>{{ state.count }}</span>
                </el-col>
                <el-col :span="16" class="buttonbox">
                    <el-button type="text" @click="inc">展开</el-button>
                </el-col>
            </el-row>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
    </el-card>
</template>

<style scoped>
.buttonbox {
    text-align: right;
}
</style>