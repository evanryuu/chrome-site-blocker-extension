<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';

import { APP_STATUS, FOCUS_QUENE, URLS, WHITE_LIST_MODE } from '@/config/constant';
import Countdown from '@/components/Countdown.vue';
import type { IUrl } from '@/@types';

import { getItem, setItem, returnHost } from '../utils';
import type { IStageQuene } from '../utils/storage';

const status = ref<{ key: 'appStatus' | 'whiteListMode', val: boolean, label: string }[]>([
  { key: APP_STATUS, label: 'App', val: false },
  { key: WHITE_LIST_MODE, label: 'White List', val: false },
]);
const currentUrl = ref<string>('');
const allUrls = ref<IUrl[]>([]);
const urlExist = ref<boolean>(false);
const urlAdded = ref<boolean>(false);
const focusQuene = ref<IStageQuene[]>([]);

const getHost = () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    currentUrl.value = tabs[0].url as string;
    // use `url` here inside the callback because it's asynchronous!
  });
  chrome.storage.onChanged.addListener(() => {
    urlAdded.value = true;
  });
};

const initAllUrls = () => {
  getItem(URLS).then((urls: IUrl[]) => {
    if (!urls || !urls.length) {
      setItem(URLS, []);
      return;
    }
    allUrls.value = urls;
    console.log('allUrls', allUrls.value, currentUrl.value);

    const existUrl = urls.find((u) => currentUrl.value.includes(u.url));
    if (existUrl) {
      urlExist.value = true;
    }
  });
};

const initAppStatus = async () => {
  status.value.forEach(async (item, i) => {
    const res = await getItem(item.key);
    status.value[i].val = res;
  });
};

const initFocusQuene = async () => {
  focusQuene.value = await getItem(FOCUS_QUENE);
};

const addUrlToList = () => {
  if (urlExist.value) return;

  setItem(URLS, [
    ...allUrls.value,
    { url: returnHost(currentUrl.value) },
  ]);
};

// eslint-disable-next-line no-nested-ternary
const buttonType = computed(() => (urlExist.value ? 'info' : urlAdded.value ? 'success' : 'primary'));
// eslint-disable-next-line no-nested-ternary
const buttonText = computed(() => (urlExist.value
  ? 'Already in your list'
  : urlAdded.value
    ? 'OK!' : 'Add it to list'));

const gotoOption = () => {
  chrome.tabs.create({ url: 'options.html' });
};

getHost();
initAllUrls();
initAppStatus();
initFocusQuene();
</script>

<template>
  <div class="app">
    <div class="header-container">
      <div class="title">
        <span>Site blocker</span>
        <el-icon @click="gotoOption" :size="24">
          <Setting />
        </el-icon>
      </div>
      <div class="setting-blocks"></div>
    </div>
    <div class="main-container">
      <div class="tag-container">
        <el-tag v-for="tag in status" :key="tag.key" :type="tag.val ? '' : 'info'">
          {{ tag.label }} {{ tag.val ? `ON` : `OFF` }}
        </el-tag>
      </div>
      <div v-if="focusQuene.length === 0">
        <p class="hint">You are currently browsing</p>
        <h1> {{ returnHost(currentUrl!) }} </h1>
        <p v-if="urlExist">This site is in your list.</p>
        <p v-else-if="urlAdded">Add completed!</p>
        <p v-else>Do you want to add it into block list?</p>

        <el-button :type="buttonType" @click="addUrlToList">
          {{ buttonText }}</el-button>
      </div>
      <div v-else>
        <Countdown @countdown-end="() => { focusQuene = [] }" />
      </div>

    </div>
    <div class="footer-container">

    </div>
  </div>
</template>

<style>
.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
  min-width: 280px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0c795d;
  color: white;
  font-size: 14px;
  height: 44px;
}

.main-container {
  padding: 12px;
  position: relative;
}

.tag-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.tag-container>.el-tag+.el-tag {
  margin-top: 8px;
}

.title {
  display: flex;
  width: 100%;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;
}

.title>.el-icon {
  cursor: pointer;
}

.footer-container {
  padding: 12px;
}
</style>

<style>
h2 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

p {
  padding: 12px;
}
</style>
