export const setBadge = (text: string, tabId?: number) => {
  const badge: {text: string, tabId?: number} = {
    text,
  };
  if (tabId !== undefined) badge.tabId = tabId;
  chrome.action.setBadgeText(badge);
};
