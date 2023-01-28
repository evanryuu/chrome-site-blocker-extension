<script setup lang='ts'>
import { ref } from 'vue';

import { getRandomNumber } from '@/utils/number';

const imgUrl = chrome.runtime.getURL(`images/pic${getRandomNumber(1, 10)}.png`);

const bgCss = `
.background {
      filter: brightness(60%);
      background-color: rgb(33, 33, 33);
      background-image: url(${imgUrl});
      position: absolute;
      top: 0; bottom: 0;
      left:0; right: 0;
      z-index: -1;
      background-position: center center;
      width: 100%;
      height: 100%;
      transition: background 0.5s linear 0s;
      background-size: cover !important;
  }
`;

document.head.insertAdjacentHTML('beforeend', `
<style>
${bgCss}
</style>
`);

</script>

<template>
  <div id="block-page">
    <div class="block-page-title">
      <div class="title">This site is in your block list.</div> <br>
     <div class="subtitle"> btw you really need to focus on your job.</div>
    </div>
    <div class="background"></div>
  </div>
</template>

<style scoped>
.block-page-title {
  position: fixed;
  left: 40px;
  top: 80px;
  font-weight: 600;
  color: #fff;
}
.title {
  font-size: 48px;
}
.subtitle {
  font-size: 20px;
  text-align: right;
}
</style>
