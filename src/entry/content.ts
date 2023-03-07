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
import { APP_STATUS, URLS, WHITE_LIST_MODE, FOCUS_MODE_SETTING } from '@/config/constant';
import { getItem, getRandomNumber, initFocusQuene } from '@/utils';

import type { IStageQuene } from '@/utils';
import { IUrl } from '@/@types/index.d';

const img = document.createElement('img');
const iconUrl = chrome.runtime.getURL(`images/pic${getRandomNumber(1, 10)}.png`);
img.src = iconUrl;

const blockPage = () => {
  window.location.replace(`chrome-extension://${chrome.runtime.id}/options.html#/block-page`);
};

const handleWhitelistUrls = async (whiteListMode: boolean, urls: IUrl[]) => {
  const isExist = urls.some((u) => window.location.href.includes(u.url));
  return whiteListMode ? !isExist : isExist;
};

const ifShouldBlock = async <T extends boolean>(isInFocusMode: T, focusQuene?: IStageQuene[]) => {
  const whiteListMode = await getItem(WHITE_LIST_MODE);
  const urls = await getItem(URLS);
  if (isInFocusMode === true) {
    const focusModeSetting = await getItem(FOCUS_MODE_SETTING);
    // if focus mode block settings are the same as general setting
    if (focusModeSetting.same) {
      return handleWhitelistUrls(whiteListMode, urls);
    }
    // if they are customized settings
    const { stage } = focusQuene![0];
    if (stage === 'focusing') {
      return handleWhitelistUrls(focusModeSetting.whiteListMode, focusModeSetting.urls);
    }
    return false;
  }
  return handleWhitelistUrls(whiteListMode, urls);
};

const handleAppInFocusMode = async (quene: IStageQuene[]) => {
  const shouldBlock = await ifShouldBlock(true, quene);
  if (shouldBlock) blockPage();
};

const handleAppNotInFocusMode = async () => {
  const appStatus = await getItem(APP_STATUS);
  if (appStatus) {
    const shouldBlock = await ifShouldBlock(false);
    if (shouldBlock) {
      // setBody('Oops! You\'ve blocked this site!');
      blockPage();
    }
  }
};

const init = async () => {
  const focusQuene = await initFocusQuene();
  // Still in focus mode
  if (focusQuene.length) {
    handleAppInFocusMode(focusQuene);
  } else {
    handleAppNotInFocusMode();
  }
};

init();
