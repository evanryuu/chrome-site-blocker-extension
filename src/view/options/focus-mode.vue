<!--
 * @Author: evankwolf
 * @Date: 2023-01-29 09:09:50
 * @LastEditors: evankwolf
 * @LastEditTime: 2023-01-30 16:16:56
 * @FilePath: \chrome-site-blocker-extension\src\view\options\focus-mode.vue
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';

import type { IFocusModeSetting, IStageQuene } from '@/utils';
import type { ICountdown, IUrl } from '@/@types/index.d';

import { getItem, setItem, initFocusQuene as initQuene, validateUrl } from '@/utils';
import { APP_STATUS, FOCUS_MODE_SETTING, FOCUS_QUENE, MIN, URLS } from '@/config/constant';
import { setBadge } from '../../utils/chrome';

const timeFormRef = ref<FormInstance>();
const focusQuene = ref<IStageQuene[]>([]);

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<IUrl>({
  url: '',
});

const focusModeSetting = ref<IFocusModeSetting>({
  duration: 0,
  relaxing: 0,
  repeat: 0,
  same: false,
  whiteListMode: false,
  urls: [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkUrl = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the url'));
  }

  if (!validateUrl(value)) {
    return callback(new Error('Url form is not correct'));
  }
  return callback();
};

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

const urlRules = ref({
  url: [{ validator: checkUrl, trigger: 'blur' }],
});

const sameSetting = computed(() => (focusModeSetting.value.same ? 'ON' : 'OFF'));

const setFocusSetting = async (data: IFocusModeSetting) => {
  setItem(FOCUS_MODE_SETTING, data);
};

const setFocusQuene = (quene: IStageQuene[]) => {
  setItem(FOCUS_QUENE, quene);
  focusQuene.value = quene;
};

const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  const appStatus = await getItem(APP_STATUS);
  setBadge(appStatus ? 'ON' : 'OFF');
  setFocusQuene([]);
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      const { repeat, duration, relaxing } = focusModeSetting.value;
      console.log('submit', focusModeSetting.value);

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
          end: start + ((i + 1) * duration + i * relaxing) * MIN,
        });
        quene.push({
          id: length + 2,
          duration: relaxing * MIN,
          stage: 'relaxing',
          start: start + ((i + 1) * duration + i * relaxing) * MIN,
          end: start + (i + 1) * (relaxing + duration) * MIN,
        });
      }
      setBadge('🕔');
      setFocusQuene(quene);
      setFocusSetting(focusModeSetting.value);
      return true;
    }
    console.log('error submit!');
    return false;
  });
};

const onCountdownProgress = async (data: ICountdown) => {
  const quene = focusQuene.value.slice();
  quene[0].duration = data.totalSeconds * 1000;
  setFocusQuene(quene);
};

// const onCountdownEnd = () => {
//   // popup.vue also does this, so we don't need to do it twice
//   setFocusQuene(focusQuene.value.slice(1));
// };

const initFocusModeSetting = async () => {
  focusModeSetting.value = await getItem(FOCUS_MODE_SETTING);
};

const initFocusQuene = async () => {
  const res = await initQuene();
  setFocusQuene(res);
};

const countdown = computed(() => (focusQuene.value.length
  ? focusQuene.value[0].duration
  : 0));

const getIconUrl = (path: string) => `http://www.google.com/s2/favicons?domain=${path}`;

const addUrl = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      focusModeSetting.value.urls.push({ url: ruleForm.value.url });
      setFocusSetting(focusModeSetting.value);

      ElMessage({
        type: 'success',
        message: 'Add completed',
      });
      ruleForm.value.url = '';
    }
  });
};

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
      setFocusSetting(focusModeSetting.value);
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
    <div class="semi-bold text-14">Loop Settings</div>
    <!-- S Upper Section -->
    <div class="flex mt-3">
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
        <vue-countdown v-if="focusQuene.length" auto-start :time="countdown"
          @progress="(data: ICountdown) => onCountdownProgress(data)" @end="initFocusQuene"
          v-slot="{ hours, minutes, seconds }">
          <h2 class="subtitle">{{ focusQuene[0].stage.toLocaleUpperCase() }}</h2>
          <div>{{ `🕔 ${hours} hrs, ${minutes} mins, ${seconds} secs.` }}</div>
          <div v-if="focusQuene.length">Rounds left: {{ Math.floor(focusQuene.length / 2) }}</div>
        </vue-countdown>
      </div>
      <!-- E Coundown section -->
    </div>
    <!-- E Upper Section -->

    <!-- S URL Section -->
    <div>
      <div>
        <div class="semi-bold text-14">Focus Mode Block Settings</div>
        <div class="flex items-center py-2">
          <div>Same as site settings?</div>
          <el-radio-group class="ml-4" @change="handleSameChange" :model-value="sameSetting">
            <el-radio-button label="ON" />
            <el-radio-button label="OFF" />
          </el-radio-group>
        </div>
      </div>

      <div v-if="!focusModeSetting.same">
        <!-- S Input Section -->
        <div class="url-input-container">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="urlRules" @keyup.enter="addUrl">
            <el-form-item prop="url">
              <el-input v-model="ruleForm.url" type="text" autocomplete="off"
                placeholder="Enter a website, such as twitter.com" clearable />
            </el-form-item>
          </el-form>
          <el-button @click="addUrl">Add</el-button>
        </div>
        <!-- S Input Section -->

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

    </div>
    <!-- E URL Section -->

  </div>

</template>

<style scoped>
.url-input-container {
  display: flex;
}

.url-input-container>form {
  flex: 1;
  max-width: 800px;
}

.url-input-container>button {
  margin-left: 12px;
}

.url-icon {
  margin-right: 8px;
  border: 1px solid var(--el-color-info-light-5);
  border-radius: 4px;
}

.countdown-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
