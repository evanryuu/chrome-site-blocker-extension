<script setup lang='ts'>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';

import { getItem, setItem } from '@/utils';

import type { IUrl } from '@/@types/index.d';
import { URLS, APP_STATUS, WHITE_LIST_MODE } from '@/config/constant';
import { validateUrl } from '../../utils/validate';

const ruleForm = ref<IUrl>({
  url: '',
});
const urls = ref<IUrl[]>([{ url: '' }]);
const appStatus = ref<boolean>(false);
const whiteListMode = ref<boolean>(false);

const ruleFormRef = ref<FormInstance>();

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
  url: [{ validator: checkUrl, trigger: 'blur' }],
});

const getIconUrl = (path: string) => `http://www.google.com/s2/favicons?domain=${path}`;

const initUrls = () => getItem(URLS).then((res) => {
  urls.value = res;
});

const initAppStatus = () => getItem(APP_STATUS).then((res) => {
  appStatus.value = res;
});

const initWhiteList = () => getItem(WHITE_LIST_MODE).then((res) => {
  whiteListMode.value = res;
});

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
      const leftUrls = urls.value.filter((u) => u.url !== url.url);
      console.log(leftUrls);
      setItem(URLS, [
        ...leftUrls,
      ]);
      urls.value = leftUrls;
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

const addUrl = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      const allUrls = [
        ...urls.value,
        { url: ruleForm.value.url },
      ];
      setItem(URLS, allUrls);
      urls.value.push({ url: ruleForm.value.url });

      ElMessage({
        type: 'success',
        message: 'Add completed',
      });
      ruleForm.value.url = '';
    }
  });
};

const appStatusChanged = (val: boolean) => {
  setItem(APP_STATUS, val);
  chrome.action.setBadgeText({
    text: val ? 'ON' : 'OFF',
  });
};

const whiteListModeChanged = (val: boolean) => {
  setItem(WHITE_LIST_MODE, val);
};

initUrls();
initAppStatus();
initWhiteList();
</script>

<template>
  <div id="site-settings-page">
    <div class="semi-bold text-14">General</div>
    <div class="extension-status mt-2">
      <span>Extension is {{ appStatus ? 'on' : 'off' }} </span>
      <el-switch style="margin-left: 20px;" v-model="appStatus" @change="appStatusChanged"></el-switch>
    </div>
    <div class="extension-status">
      <span>White List Mode is {{ whiteListMode ? 'on' : 'off' }} </span>
      <el-switch style="margin-left: 20px;" v-model="whiteListMode" @change="whiteListModeChanged"></el-switch>
    </div>

    <div class="semi-bold mt-5 text-14">Block List</div>
    <div class="url-input-container">
      <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      @keyup.enter="addUrl"
    >
        <el-form-item prop="url">
          <el-input
          v-model="ruleForm.url"
          type="text"
          autocomplete="off"
          placeholder="Enter a website, such as twitter.com"
          clearable
          />
        </el-form-item>
      </el-form>
      <el-button @click="addUrl">Add</el-button>
    </div>

    <el-table class="url-table" :data="urls" style="width: 100%;">
      <el-table-column label="Blocked Url">
        <template #default="scope">
          <img class="url-icon" :src="getIconUrl(scope.row.url)" width="20" height="20" alt="">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.url">
            <span>{{ scope.row.url }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120" label="Operation">
        <template #default="scope">
          <el-button
          size="small"
          type="danger"
          @click="handleButtonClicked(scope.row)"
        >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.url-input-container {
  display: flex;
}
.url-input-container > form {
  flex: 1;
  max-width: 800px;
}
.url-input-container > button {
  margin-left: 12px;
}
.url-icon {
  margin-right: 8px;
  border: 1px solid var(--el-color-info-light-5);
  border-radius: 4px;
}
</style>
