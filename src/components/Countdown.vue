<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue';

import type { IFocusModeSetting, IStageQuene } from '@/utils/storage';
import type { ICountdown } from '@/@types/index.d';

import { getItem, setBadge, setItem } from '@/utils';
import { FOCUS_MODE_SETTING, FOCUS_QUENE, APP_STATUS } from '@/config/constant';

const emit = defineEmits(['countdownEnd']);

const focusQuene = ref<IStageQuene[]>([]);

const focusModeSetting = ref<IFocusModeSetting>({
  duration: 0,
  relaxing: 0,
  repeat: 0,
  same: false,
  whiteListMode: false,
  urls: [],
});

const setFocusQuene = (quene: IStageQuene[]) => {
  setItem(FOCUS_QUENE, quene);
  focusQuene.value = quene;
};

const onCountdownProgress = async (data: ICountdown) => {
  console.log('onCountdownProgress', data);

  // const quene = await getItem(FOCUS_QUENE);
  const quene = focusQuene.value.slice();
  quene[0].duration = data.totalSeconds * 1000;
  setFocusQuene(quene);
};

const onCountdownEnd = async () => {
  const quene = focusQuene.value.slice(1);
  setFocusQuene(quene);
  if (quene.length === 0) {
    const appStatus = await getItem(APP_STATUS);
    setBadge(appStatus ? 'ON' : 'OFF');
    emit('countdownEnd');
  } else {
    console.log('setBadge', quene[0].stage === 'focusing' ? '🕔' : '☕');

    setBadge(quene[0].stage === 'focusing' ? '🕔' : '☕');
  }
};

const initFocusModeSetting = async () => {
  focusModeSetting.value = await getItem(FOCUS_MODE_SETTING);
};

const initFocusQuene = async () => {
  const res = await getItem(FOCUS_QUENE);
  const now = Date.now();

  /** remove expired stages */
  const curQueneIndex = res.findIndex((data) => data.start < now && data.end > now);

  if (curQueneIndex !== -1) {
    res[curQueneIndex].duration = res[curQueneIndex].end - now;
    setFocusQuene(res.slice(curQueneIndex));
  } else {
    setFocusQuene([]);
  }
};

const countdown = computed(() => (focusQuene.value.length
  ? focusQuene.value[0].duration
  : 0));

initFocusQuene();
initFocusModeSetting();
</script>

<template>
  <!-- S Coundown section -->
  <div class="countdown-container">
    <vue-countdown v-if="focusQuene.length" auto-start :time="countdown"
      @progress="(data: ICountdown) => onCountdownProgress(data)" @end="onCountdownEnd"
      v-slot="{ hours, minutes, seconds }">
      <h2 class="subtitle">{{ focusQuene[0].stage }}</h2>
      {{ `Remaining：🕔 ${hours} hrs, ${minutes} minutes, ${seconds} seconds.` }}
      <div v-if="focusQuene.length">Rounds left: {{ Math.floor(focusQuene.length / 2) }}</div>
    </vue-countdown>
  </div>
  <!-- E Coundown section -->
</template>

<style scoped>
.countdown-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
