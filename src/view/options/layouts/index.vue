<script lang="ts" setup>
import AppMain from './app-main.vue';
import Sidebar from './sidebar.vue';

// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header class="layout-header">

      </el-header> -->
      <Sidebar />
      <AppMain />
    </el-container>
  </div>
</template>

<style scoped>
.layout-header {
  height: var(--sb-header-height);
  background: var(--sb-theme-color);
}
</style>
