<script setup lang='ts'>
import { filterRoutes } from '@/utils/route';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const currentRoute = useRoute();
const allRoutes = router.getRoutes();
const filteredRoutes = filterRoutes(allRoutes);
</script>

<template>
      <el-aside class="sidebar-container">
        <el-menu :default-active="currentRoute.path" class="el-menu-vertical-demo">
          <el-menu-item
          v-for="route in filteredRoutes"
          :key="route.path"
          :index="route.path"
          @click="router.push(route.path)"
          >
            <el-icon>
              <component :is="route.meta!.icon"></component>
            </el-icon>
            <span>{{ route.meta!.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
</template>

<style scoped>

</style>
