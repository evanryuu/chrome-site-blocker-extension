<script setup lang='ts'>
import PageTitle from '@/components/PageTitle.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="app-main">
    <PageTitle :title="(route.meta.title as string)" />
    <el-main>
      <router-view />
    </el-main>
  </div>

</template>

<style scoped>
.app-main {
  position: fixed;
  padding: 20px;
  right: 0;
  top: var(--sb-header-height);
  width: calc(100% - var(--sb-sidebar-width));
}
</style>
