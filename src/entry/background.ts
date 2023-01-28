import { APP_STATUS } from '@/config/constant';
import { getItem, setItem } from '@/utils';
import type { IStorage } from '@/utils/storage';

/** set needed settings to default value */
const initOptions = async () => {
  const defaultData: IStorage = {
    appStatus: false,
    urls: [],
    focusQuene: [],
    focusModeSetting: {
      duration: 25,
      relaxing: 5,
      repeat: 2,
      same: false,
      urls: [],
    },
    whiteListMode: false,
  };

  (Object.keys(defaultData) as Array<keyof typeof defaultData>).forEach(async (key) => {
    const storageData = await getItem(key);
    if (storageData === undefined || storageData === null) {
      setItem(key, defaultData[key]);
    }
  });
};

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

// async function changeFocusQuene() {
//   const focusQuene = await getItem(FOCUS_QUENE);
//   if (!focusQuene || focusQuene.length === 0) {
//     return false;
//   }
//   const now = Date.now();

//   const currentStageIndex = focusQuene.findIndex((s) => s.start < now && s.end > now);
//   if (currentStageIndex === -1) {
//     return setItem(FOCUS_QUENE, []);
//   }
//   const quene = focusQuene.slice(currentStageIndex);
//   quene[0].duration = quene[0].end - now;
//   setTimeout(() => {
//     setItem(FOCUS_QUENE, quene);
//   }, 1000);
//   return true;
// }

// changeFocusQuene();
