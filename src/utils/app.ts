import { APP_STATUS, FOCUS_QUENE } from '@/config/constant';
import { UAppStatus } from '@/@types/index.d';
import { setBadge } from './chrome';
import { getItem, IStorage, setItem } from './storage';

export const initOptions = async () => {
  const defaultData: IStorage = {
    appStatus: false,
    urls: [],
    focusQuene: [],
    focusModeSetting: {
      duration: 25,
      relaxing: 5,
      repeat: 2,
      same: false,
      whiteListMode: false,
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

export const initFocusQuene = async () => {
  const focusQuene = await getItem(FOCUS_QUENE);

  if (!focusQuene || focusQuene.length === 0) return [];

  /** check if focus mode is expired */
  const now = Date.now();
  const curQueneIndex = focusQuene.findIndex((data) => data.start < now && data.end > now);
  if (curQueneIndex === -1) {
    setItem(FOCUS_QUENE, []);
    return [];
  }

  /** remove expired stages */
  const res = focusQuene.slice(curQueneIndex);
  /** count current quene left duration */
  res[0].duration = res[0].end - now;
  /** calibrate focus quene */
  setItem(FOCUS_QUENE, res);

  return res;
};

export const specifyAppStatus = async () => {
  const focusQuene = await getItem(FOCUS_QUENE);
  if (focusQuene && focusQuene.length > 0) {
    return focusQuene[0].stage;
  }
  const appStatus = await getItem(APP_STATUS);
  return appStatus;
};

export const setBadgeByCurrentStatus = async (status?: UAppStatus) => {
  const returnText = (t: UAppStatus) => {
    switch (t) {
      case true: return 'ON';
      case false: return 'OFF';
      case 'focusing': return '🕔';
      case 'relaxing': return '☕';
      default: return 'OFF';
    }
  };
  if (status === undefined) {
    // eslint-disable-next-line no-param-reassign
    status = await specifyAppStatus();
  }

  setBadge(returnText(status));
};
