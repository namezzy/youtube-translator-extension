document.addEventListener('DOMContentLoaded', async () => {
  const translateBtn = document.getElementById('translateBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');
  const optionsLink = document.getElementById('optionsLink');

  // 检查配置
  async function checkConfig() {
    const config = await chrome.storage.sync.get(['apiProvider', 'openaiKey', 'claudeKey']);
    
    if (!config.apiProvider) {
      showStatus('请先配置 API 设置', 'warning');
      translateBtn.disabled = true;
      return false;
    }

    if (config.apiProvider === 'openai' && !config.openaiKey) {
      showStatus('请配置 OpenAI API Key', 'error');
      translateBtn.disabled = true;
      return false;
    }

    if (config.apiProvider === 'claude' && !config.claudeKey) {
      showStatus('请配置 Claude API Key', 'error');
      translateBtn.disabled = true;
      return false;
    }

    showStatus('配置正常，可以开始翻译', 'success');
    translateBtn.disabled = false;
    return true;
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }

  // 开始翻译
  translateBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('youtube.com/watch')) {
      showStatus('请在 YouTube 视频页面使用', 'error');
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'startTranslation' }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('请刷新页面后重试', 'error');
        return;
      }
      
      if (response.success) {
        showStatus('翻译已启动', 'success');
        translateBtn.style.display = 'none';
        stopBtn.style.display = 'block';
      } else {
        showStatus(response.message || '启动失败', 'error');
      }
    });
  });

  // 停止翻译
  stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'stopTranslation' });
    
    showStatus('翻译已停止', 'warning');
    translateBtn.style.display = 'block';
    stopBtn.style.display = 'none';
  });

  // 打开设置页面
  optionsLink.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 初始化
  await checkConfig();
});
