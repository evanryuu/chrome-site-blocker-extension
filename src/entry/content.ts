import { APP_STATUS, URLS, WHITE_LIST_MODE } from '@/config/constant';
import { getItem, getRandomNumber, initFocusQuene } from '@/utils';
import type { IStageQuene } from '@/utils';

const img = document.createElement('img');
const iconUrl = chrome.runtime.getURL(`images/pic0${getRandomNumber(1, 4)}.png`);
img.src = iconUrl;

const blockPage = () => {
  window.location.replace(`chrome-extension://${chrome.runtime.id}/options.html#/block-page`);
};

const handleAppInFocusMode = (quene: IStageQuene[]) => {
  const { stage } = quene[0];
  if (stage === 'focusing') {
    blockPage();
  }
};

const handleAppNotInFocusMode = async () => {
  const appStatus = await getItem(APP_STATUS);
  if (appStatus) {
    const whiteListMode = await getItem(WHITE_LIST_MODE);
    const urls = await getItem(URLS);
    console.log('hello world content todo something~', urls);
    const isExist = urls.some((u) => window.location.href.includes(u.url));

    const shouldBlock = whiteListMode ? !isExist : isExist;
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
