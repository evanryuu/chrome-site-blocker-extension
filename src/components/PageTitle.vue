<script setup lang='ts'>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h2 class="page-title">
    {{ title }}
  </h2>
</template>

<style scoped>
.page-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}
</style>
