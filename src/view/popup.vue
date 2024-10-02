<!-- eslint-disable no-nested-ternary -->
<!-- eslint-disable implicit-arrow-linebreak -->
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Setting } from '@element-plus/icons-vue';

import { APP_STATUS, FOCUS_QUENE, URLS, WHITE_LIST_MODE, WHITE_LIST_URLS } from '@/config/constant';
import Countdown from '@/components/Countdown.vue';
import { debounce } from 'lodash';
import type { IUrl } from '@/@types';

import { getItem, setItem, returnHost } from '../utils';
import type { IStageQuene } from '../utils/storage';

const status = ref<{ key: 'appStatus' | 'whiteListMode'; val: boolean; label: string }[]>([
  { key: APP_STATUS, label: 'App', val: false },
  { key: WHITE_LIST_MODE, label: 'White List', val: false },
]);
const currentUrl = ref<string>('');
const allUrls = ref<IUrl[]>([]);
const urlExist = ref<boolean>(false);
const urlAdded = ref<boolean>(false);
const focusQuene = ref<IStageQuene[]>([]);
const error = ref<string | null>(null);

const getHost = () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      currentUrl.value = tabs[0].url;
      console.log('Current URL:', currentUrl.value);
    } else {
      error.value = 'Unable to get current tab URL';
      console.error(error.value);
    }
  });
  chrome.storage.onChanged.addListener(() => {
    urlAdded.value = true;
  });
};

const initAllUrls = async () => {
  try {
    const whiteListMode = await getItem(WHITE_LIST_MODE);
    const storageKey = whiteListMode ? WHITE_LIST_URLS : URLS;
    let urls = (await getItem(storageKey)) || [];

    // 确保 urls 是一个数组
    if (!Array.isArray(urls)) {
      console.error('URLs is not an array:', urls);
      urls = [];
    }

    // 如果 urlAdded 为 true，我们需要添加当前 URL
    if (urlAdded.value && currentUrl.value) {
      const newUrl = returnHost(currentUrl.value);
      const urlExists = urls.some((u) => u.url === newUrl);

      if (!urlExists) {
        urls.push({
          url: newUrl,
          // id: new Date().getTime(),
        });
        await setItem(storageKey, urls);
        console.log('New URL added:', newUrl);
      } else {
        console.log('URL already exists:', newUrl);
      }

      // 重置 urlAdded
      urlAdded.value = false;
    }

    allUrls.value = urls;
    console.log('All URLs:', allUrls.value);

    // 更新 urlExist
    urlExist.value = allUrls.value.some((u) => u.url === returnHost(currentUrl.value));
    console.log('URL exists:', urlExist.value);
  } catch (err) {
    error.value = 'Error initializing URLs: ' + (err as Error).message;
    console.error(error.value);
  }
};

const debouncedInitAllUrls = debounce(initAllUrls, 300);

chrome.storage.onChanged.addListener(() => {
  urlAdded.value = true;
  debouncedInitAllUrls();
});

const initAppStatus = async () => {
  try {
    for (const item of status.value) {
      const res = await getItem(item.key);
      item.val = res;
    }
    console.log('App status:', status.value);
  } catch (err) {
    error.value = 'Error initializing app status: ' + (err as Error).message;
    console.error(error.value);
  }
};

const initFocusQuene = async () => {
  try {
    focusQuene.value = (await getItem(FOCUS_QUENE)) || [];
    console.log('Focus queue:', focusQuene.value);
  } catch (err) {
    error.value = 'Error initializing focus queue: ' + (err as Error).message;
    console.error(error.value);
  }
};

const addUrlToList = () => {
  if (urlExist.value) return;
  urlAdded.value = true;
  initAllUrls();
};

// eslint-disable-next-line no-nested-ternary
const buttonType = computed(() => (urlExist.value ? 'info' : urlAdded.value ? 'success' : 'primary'));
// eslint-disable-next-line no-confusing-arrow
const buttonText = computed(() =>
  urlExist.value ? 'Already in your list' : urlAdded.value ? 'OK!' : 'Add it to list',
);

const gotoOption = () => {
  chrome.tabs.create({ url: 'options.html' });
};

onMounted(() => {
  getHost();
  initAllUrls();
  initAppStatus();
  initFocusQuene();
});
</script>

<template>
  <div class="app">
    <div class="header-container">
      <div class="title flex justify-between">
        <span>Site blocker</span>
        <el-icon @click="gotoOption" :size="24">
          <Setting />
        </el-icon>
      </div>
      <div class="setting-blocks"></div>
    </div>
    <div
      class="main-container"
      :class="{
        'in-focus': focusQuene.length,
      }">
      <div class="tag-container">
        <el-tag v-for="tag in status" :key="tag.key" :type="tag.val ? '' : 'info'">
          {{ tag.label }} {{ tag.val ? `ON` : `OFF` }}
        </el-tag>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else>
        <div v-if="focusQuene.length === 0">
          <p class="hint">You are currently browsing</p>
          <h1> {{ returnHost(currentUrl!) }} </h1>
          <p v-if="urlExist">This site is in your list.</p>
          <p v-else-if="urlAdded">Add completed!</p>
          <p v-else>Do you want to add it into block list?</p>

          <el-button :type="buttonType" @click="addUrlToList"> {{ buttonText }}</el-button>
        </div>
        <div v-else class="countdown-content">
          <Countdown
            @countdown-end="
              () => {
                focusQuene = [];
              }
            " />
        </div>
      </div>
    </div>
    <div class="footer-container"> </div>
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

.main-container.in-focus .tag-container {
  opacity: 0;
  pointer-events: none;
}

.tag-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.tag-container > .el-tag + .el-tag {
  margin-top: 8px;
}

.title {
  display: flex;
  width: 100%;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;
}

.title > .el-icon {
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

<style>
.error-message {
  color: red;
  padding: 12px;
}
</style>
