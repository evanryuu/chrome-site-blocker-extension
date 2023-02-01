import { APP_STATUS } from '@/config/constant';
import { getItem, initOptions, setBadgeByCurrentStatus } from '@/utils';

const initBadge = async () => {
  const res = await getItem(APP_STATUS);
  chrome.action.setBadgeText({
    text: res ? 'ON' : 'OFF',
  });
};

console.log('background!');
chrome.runtime.onInstalled.addListener(async () => {
  initOptions();
  initBadge();
});

function calibrateBadge() {
  setTimeout(() => {
    setBadgeByCurrentStatus();
    calibrateBadge();
  }, 2000);
}

calibrateBadge();
