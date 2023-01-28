<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

import type { IFocusModeSetting, IStageQuene } from '@/utils';
import type { ICountdown, IUrl } from '@/@types/index.d';

import { getItem, setItem, initFocusQuene as initQuene } from '@/utils';
import { FOCUS_MODE_SETTING, FOCUS_QUENE, MIN, URLS } from '@/config/constant';

const timeFormRef = ref<FormInstance>();
const focusQuene = ref<IStageQuene[]>([]);

const focusModeSetting = ref<IFocusModeSetting>({
  duration: 0,
  relaxing: 0,
  repeat: 0,
  same: false,
  urls: [],
});

const rules = ref({
  duration: [
    { required: true, message: 'Please input duration', trigger: 'blur' },
    { min: 0, max: 5, message: 'Length should be at least 1 minute', trigger: 'blur' },
  ],
  relaxing: [
    { required: true, message: 'Please input the relaxing interval', trigger: 'blur' },
    { min: 1, max: 5, message: 'Length should be at least 1 minute', trigger: 'blur' },
  ],
  rounds: [
    { required: true, message: 'Please input how many rounds you want to focus', trigger: 'blur' },
    { min: 0, max: 50, message: 'Length should be above 0', trigger: 'blur' },
  ],
});

const sameSetting = computed(() => (focusModeSetting.value.same ? 'ON' : 'OFF'));

const setFocusSetting = async (data: IFocusModeSetting) => {
  setItem(FOCUS_MODE_SETTING, data);
};

const setFocusQuene = (quene: IStageQuene[]) => {
  setItem(FOCUS_QUENE, quene);
  focusQuene.value = quene;
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  setFocusQuene([]);
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      const { repeat, duration, relaxing } = focusModeSetting.value;

      const quene: IStageQuene[] = [];
      const start = Date.now();
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < repeat; i++) {
        const { length } = quene;
        quene.push({
          id: length + 1,
          duration: duration * MIN,
          stage: 'focusing',
          start: start + i * (relaxing + duration) * MIN,
          end: start + (i + 1) * duration * MIN,
        });
        quene.push({
          id: length + 2,
          duration: relaxing * MIN,
          stage: 'relaxing',
          start: start + (i + 1) * duration * MIN,
          end: start + (i + 1) * (relaxing + duration) * MIN,
        });
      }

      setFocusQuene(quene);
      setFocusSetting(focusModeSetting.value);
      return true;
    }
    console.log('error submit!');
    return false;
  });
};

const onCountdownProgress = async (data: ICountdown) => {
  console.log('onCountdownProgress', data);

  // const quene = await getItem(FOCUS_QUENE);
  const quene = focusQuene.value.slice();
  quene[0].duration = data.totalSeconds * 1000;
  setFocusQuene(quene);
};

const onCountdownEnd = () => {
  setFocusQuene(focusQuene.value.slice(1));
};

const initFocusModeSetting = async () => {
  const res = await getItem(FOCUS_MODE_SETTING);
  focusModeSetting.value = res;
};

const initFocusQuene = async () => {
  const res = await initQuene();
  setFocusQuene(res);
};

const countdown = computed(() => (focusQuene.value.length
  ? focusQuene.value[0].duration
  : 0));

const getIconUrl = (path: string) => `http://www.google.com/s2/favicons?domain=${path}`;

const handleButtonClicked = (url: IUrl) => {
  ElMessageBox.confirm(
    `\n
    ${url.url}`,
    'Are you sure you want to delete this link?',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      const leftUrls = focusModeSetting.value.urls.filter((u) => u.url !== url.url);
      console.log(leftUrls);
      setItem(URLS, [
        ...leftUrls,
      ]);
      focusModeSetting.value.urls = leftUrls;
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

const handleSameChange = (data: 'ON' | 'OFF') => {
  focusModeSetting.value.same = data === 'ON';
};

initFocusQuene();
initFocusModeSetting();
</script>

<template>
  <div id="focus-mode-page">
    <!-- S Upper Section -->
    <div class="flex">
      <!-- S Form section -->
      <el-form ref="timeFormRef" :model="focusModeSetting" status-icon :rules="rules" label-width="120px"
        label-position="top" class="demo-timeForm">
        <el-form-item label="Duration" prop="pass">
          <el-input-number controls-position="right" v-model="focusModeSetting.duration" :min="0" :max="120"
            :step="1" />
        </el-form-item>
        <el-form-item label="Interval" prop="pass">
          <el-input-number controls-position="right" v-model="focusModeSetting.relaxing" :min="0" :max="60" :step="1" />
        </el-form-item>
        <el-form-item label="Repeat" prop="pass">
          <el-input-number controls-position="right" v-model="focusModeSetting.repeat" :min="0" :max="20" :step="1" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="Boolean(focusQuene.length)" type="primary" @click="submitForm(timeFormRef)">Focus right
            now</el-button>
          <el-button @click="resetForm(timeFormRef)">Reset</el-button>
        </el-form-item>
      </el-form>
      <!-- E Form section -->

      <!-- S Coundown section -->
      <div class="countdown-container">
        <vue-countdown v-if="focusQuene.length && focusQuene[0].stage === 'focusing'" auto-start :time="countdown"
          @progress="(data: ICountdown) => onCountdownProgress(data)" @end="onCountdownEnd"
          v-slot="{ hours, minutes, seconds }">
          {{ `${focusQuene[0].stage}
          Remaining：🕔 ${hours} hrs, ${minutes} minutes, ${seconds} seconds.` }}
        </vue-countdown>
        <vue-countdown v-if="focusQuene.length && focusQuene[0].stage === 'relaxing'" auto-start :time="countdown"
          @progress="(data: ICountdown) => onCountdownProgress(data)" @end="onCountdownEnd"
          v-slot="{ hours, minutes, seconds }">
          {{ `${focusQuene[0].stage}
          Remaining：🕔 ${hours} hrs, ${minutes} minutes, ${seconds} seconds.` }}
        </vue-countdown>

        <br>
        Rounds left: {{ Math.floor(focusQuene.length / 2) }}
      </div>
      <!-- E Coundown section -->
    </div>
    <!-- E Upper Section -->

    <!-- S URL Section -->
    <div>
      <div>
        <div class="subtitle">Focus Mode Blocklist</div>
        <div class="flex items-center py-2">
          <div>Same as site settings?</div>
          <el-radio-group class="ml-4" @change="handleSameChange" :model-value="sameSetting">
            <el-radio-button label="ON" />
            <el-radio-button label="OFF" />
          </el-radio-group>
        </div>

      </div>
      <!-- S Table Section -->
      <el-table class="url-table" :data="focusModeSetting.urls" style="width: 100%;">
        <el-table-column label="Blocked Url In Focus Mode">
          <template #default="scope">
            <img class="url-icon" :src="getIconUrl(scope.row.url)" width="20" height="20" alt="">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.url">
              <span>{{ scope.row.url }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="120" label="Operation">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleButtonClicked(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- E Table Section -->
    </div>
    <!-- E URL Section -->

  </div>

</template>
