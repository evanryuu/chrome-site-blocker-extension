import { IUrl } from '../@types/index.d';

export interface IStageQuene {
  id: number
  stage: 'focusing' | 'relaxing'
  duration: number
  start: number
  end: number
}

export interface IFocusModeSetting {
  duration: number
  relaxing: number
  repeat: number
  same: boolean
  urls: IUrl[]
}

export interface IStorage {
  urls: IUrl[]
  // eslint-disable-next-line camelcase
  appStatus: boolean
  focusQuene: IStageQuene[]
  focusModeSetting: IFocusModeSetting
  whiteListMode: boolean
}

export const getItem = <K extends keyof IStorage>(
  key: K,
): Promise<IStorage[K]> => new Promise((resolve, reject) => {
    chrome.storage.local.get([key]).then((res) => resolve(res[key])).catch(reject);
  });

export const setItem = <K extends keyof IStorage>(
  key: K,
  val: IStorage[K],
) => new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: val })
      .then(() => resolve(true)).catch(reject);
  });
