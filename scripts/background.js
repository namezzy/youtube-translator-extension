// Background Service Worker
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装时打开设置页面
    chrome.runtime.openOptionsPage();
  }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 可以在这里处理需要后台处理的任务
  return true;
});
