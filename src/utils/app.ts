import { FOCUS_QUENE } from '@/config/constant';
import { getItem, IStorage, setItem, IFocusModeSetting } from './storage';

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
