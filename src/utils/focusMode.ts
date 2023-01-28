import { FOCUS_QUENE } from '@/config/constant';
import { getItem, setItem } from './storage';

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
