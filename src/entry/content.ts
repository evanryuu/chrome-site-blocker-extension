/*
 * @Author: evankwolf
 * @Date: 2023-01-29 09:09:50
 * @LastEditors: evankwolf
 * @LastEditTime: 2023-01-30 16:53:46
 * @FilePath: \chrome-site-blocker-extension\src\entry\content.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { APP_STATUS, URLS, WHITE_LIST_MODE, FOCUS_MODE_SETTING, WHITE_LIST_URLS } from '@/config/constant';
import { getItem, getRandomNumber, initFocusQuene } from '@/utils';

import type { IStageQuene } from '@/utils';
import { IUrl } from '@/@types/index.d';

const img = document.createElement('img');
const iconUrl = chrome.runtime.getURL(`images/pic${getRandomNumber(1, 10)}.png`);
img.src = iconUrl;

// 移除所有阻止逻辑，只保留必要的内容脚本功能
console.log('Content script loaded');
