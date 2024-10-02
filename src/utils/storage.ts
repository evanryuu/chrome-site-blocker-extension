import { IUrl } from '../@types/index.d';

export interface IStageQuene {
  id: number;
  stage: 'focusing' | 'relaxing';
  duration: number;
  start: number;
  end: number;
}

export interface IFocusModeSetting {
  duration: number;
  relaxing: number;
  repeat: number;
  same: boolean;
  whiteListMode: boolean;
  urls: IUrl[];
}

export interface IStorage {
  urls: IUrl[];
  whiteListUrls: IUrl[];
  // eslint-disable-next-line camelcase
  appStatus: boolean;
  focusQuene: IStageQuene[];
  focusModeSetting: IFocusModeSetting;
  whiteListMode: boolean;
}

export const getItem = <K extends keyof IStorage>(key: K): Promise<IStorage[K]> =>
  new Promise((resolve, reject) => {
    chrome.storage.local
      .get([key])
      // if you just resolve(res[key]) without transforming JSON, somehow the focusModeSetting.urls will be set as Object for some reasons.
      // no idea what cause the problem
      // .then((res) => resolve(res[key]))
      .then(res => resolve(res[key] === undefined ? undefined : JSON.parse(res[key])))
      .catch(reject);
  });

export const setItem = <K extends keyof IStorage>(key: K, val: IStorage[K]) =>
  new Promise((resolve, reject) => {
    if (val === undefined) {
      throw new Error('Cannot set val as undefined.');
    }
    // chrome.storage.local.set({ [key]: val })
    chrome.storage.local
      .set({ [key]: JSON.stringify(val) })
      .then(() => resolve(true))
      .catch(reject);
  });
