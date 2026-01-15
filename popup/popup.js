document.addEventListener('DOMContentLoaded', async () => {
  const translateBtn = document.getElementById('translateBtn');
  const stopBtn = document.getElementById('stopBtn');
  const summaryBtn = document.getElementById('summaryBtn');
  const subtitleBtn = document.getElementById('subtitleBtn');
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

  // 总结视频内容
  summaryBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('youtube.com/watch')) {
      showStatus('请在 YouTube 视频页面使用', 'error');
      return;
    }

    summaryBtn.disabled = true;
    summaryBtn.textContent = '正在总结...';
    showStatus('正在获取字幕并生成总结...', 'warning');

    chrome.tabs.sendMessage(tab.id, { action: 'summarizeVideo' }, (response) => {
      summaryBtn.disabled = false;
      summaryBtn.textContent = '📝 总结视频内容';
      
      if (chrome.runtime.lastError) {
        showStatus('请刷新页面后重试', 'error');
        return;
      }
      
      if (response.success) {
        showStatus('总结已生成，请查看视频下方', 'success');
      } else {
        showStatus(response.message || '总结失败', 'error');
      }
    });
  });

  // 下载字幕对照
  subtitleBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('youtube.com/watch')) {
      showStatus('请在 YouTube 视频页面使用', 'error');
      return;
    }

    subtitleBtn.disabled = true;
    subtitleBtn.textContent = '正在处理...';
    showStatus('正在提取字幕并翻译...', 'warning');

    chrome.tabs.sendMessage(tab.id, { action: 'downloadSubtitles' }, (response) => {
      subtitleBtn.disabled = false;
      subtitleBtn.textContent = '📥 下载字幕对照';
      
      if (chrome.runtime.lastError) {
        showStatus('请刷新页面后重试', 'error');
        return;
      }
      
      if (response.success) {
        showStatus('字幕对照已生成', 'success');
      } else {
        showStatus(response.message || '生成失败', 'error');
      }
    });
  });

  // 打开设置页面
  optionsLink.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // 初始化
  await checkConfig();
});
