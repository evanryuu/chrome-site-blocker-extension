import { APP_STATUS, URLS, WHITE_LIST_MODE, FOCUS_MODE_SETTING, WHITE_LIST_URLS } from '@/config/constant';
import { getItem, initFocusQuene } from '@/utils';
import type { IUrl } from '@/@types/index.d';

const shouldBlockNavigation = async (url: string) => {
  // 首先检查是否是扩展的阻止页面
  if (url.startsWith(chrome.runtime.getURL(''))) {
    return false;
  }

  const appStatus = await getItem(APP_STATUS);
  if (!appStatus) return false;

  // 检查是否是新标签页
  if (url === 'chrome://newtab/' || url === 'chrome://new-tab-page/') {
    return false;
  }

  const whiteListMode = await getItem(WHITE_LIST_MODE);
  const urls: IUrl[] = (await getItem(whiteListMode ? WHITE_LIST_URLS : URLS)) || [];

  // Add a check to ensure urls is an array
  if (!Array.isArray(urls)) {
    console.error('URLs is not an array:', urls);
    return false;
  }

  const isUrlMatched = urls.some((u) => {
    const newUrl = new URL(url);
    return newUrl.host.split('www.').pop()?.startsWith(u.url);
  });

  const focusQuene = await initFocusQuene();
  if (focusQuene.length) {
    const focusModeSetting = await getItem(FOCUS_MODE_SETTING);
    if (focusModeSetting.same) {
      return whiteListMode ? !isUrlMatched : isUrlMatched;
    }
    if (focusQuene[0].stage === 'focusing') {
      return focusModeSetting.whiteListMode ? !isUrlMatched : isUrlMatched;
    }
    return false;
  }

  return whiteListMode ? !isUrlMatched : isUrlMatched;
};

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId === 0) {
    const shouldBlock = await shouldBlockNavigation(details.url);
    if (shouldBlock) {
      const blockPageUrl = chrome.runtime.getURL('options.html#/block-page');
      if (details.url !== blockPageUrl) {
        chrome.tabs.update(details.tabId, { url: blockPageUrl });
      }
    }
  }
});

const initBadge = async () => {
  const res = await getItem(APP_STATUS);
  chrome.action.setBadgeText({
    text: res ? 'ON' : 'OFF',
  });
};

console.log('background script loaded!');
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed');
  await initBadge();
});

function calibrateBadge() {
  setTimeout(async () => {
    await initBadge();
    calibrateBadge();
  }, 2000);
}

calibrateBadge();
