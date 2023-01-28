<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue';

import type { IFocusModeSetting, IStageQuene } from '@/utils/storage';
import type { ICountdown } from '@/@types/index.d';

import { getItem, setItem } from '@/utils';
import { FOCUS_MODE_SETTING, FOCUS_QUENE, MIN } from '@/config/constant';

const emit = defineEmits(['countdownEnd']);

const focusQuene = ref<IStageQuene[]>([]);

const focusModeSetting = ref<IFocusModeSetting>({
  duration: 0,
  relaxing: 0,
  repeat: 0,
  same: false,
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

const onCountdownEnd = () => {
  const quene = focusQuene.value.slice(1);
  setFocusQuene(quene);
  if (quene.length === 0) {
    emit('countdownEnd');
  }
};

const initFocusModeSetting = async () => {
  const res = await getItem(FOCUS_MODE_SETTING);
  focusModeSetting.value = res;
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
    <vue-countdown v-if="focusQuene.length && focusQuene[0].stage === 'focusing'" auto-start :time="countdown"
      @progress="(data: ICountdown) => onCountdownProgress(data)" @end="onCountdownEnd"
      v-slot="{ hours, minutes, seconds }">
      <slot name="focusing">
        <div>{{ focusQuene[0].stage.toUpperCase() }}</div>
      </slot>
      {{ `🕔 ${hours} hrs, ${minutes} mins, ${seconds} secs.` }}
    </vue-countdown>
    <vue-countdown v-if="focusQuene.length && focusQuene[0].stage === 'relaxing'" auto-start :time="countdown"
      @progress="(data: ICountdown) => onCountdownProgress(data)" @end="onCountdownEnd"
      v-slot="{ hours, minutes, seconds }">
      <slot name="relaxing">
        <div>{{ focusQuene[0].stage.toUpperCase() }}</div>
      </slot>
      {{ `🕔 ${hours} hrs, ${minutes} mins, ${seconds} secs.` }}
    </vue-countdown>

    <br>
    Rounds left: {{ Math.floor(focusQuene.length / 2) }}
  </div>
  <!-- E Coundown section -->
</template>

<style scoped>

</style>
