// YouTube 字幕翻译内容脚本
let isTranslating = false;
let translationObserver = null;
let processedCaptions = new Set();

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTranslation') {
    startTranslation().then(result => {
      sendResponse(result);
    });
    return true;
  } else if (request.action === 'stopTranslation') {
    stopTranslation();
    sendResponse({ success: true });
  }
});

// 开始翻译
async function startTranslation() {
  if (isTranslating) {
    return { success: false, message: '翻译已在进行中' };
  }

  // 检查是否有字幕
  const captionWindow = document.querySelector('.ytp-caption-window-container');
  if (!captionWindow) {
    // 尝试打开字幕
    const settingsButton = document.querySelector('.ytp-subtitles-button');
    if (settingsButton && settingsButton.getAttribute('aria-pressed') === 'false') {
      settingsButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const captionCheck = document.querySelector('.ytp-caption-window-container');
    if (!captionCheck) {
      return { success: false, message: '未找到字幕，请确保视频有字幕' };
    }
  }

  isTranslating = true;
  processedCaptions.clear();

  // 创建翻译显示容器
  createTranslationContainer();

  // 监听字幕变化
  observeCaptions();

  return { success: true };
}

// 停止翻译
function stopTranslation() {
  isTranslating = false;
  if (translationObserver) {
    translationObserver.disconnect();
    translationObserver = null;
  }
  
  const container = document.getElementById('yt-translator-container');
  if (container) {
    container.remove();
  }
}

// 创建翻译显示容器
function createTranslationContainer() {
  let container = document.getElementById('yt-translator-container');
  if (container) {
    container.innerHTML = '';
    return;
  }

  container = document.createElement('div');
  container.id = 'yt-translator-container';
  container.className = 'yt-translator-box';
  
  const player = document.querySelector('#movie_player');
  if (player) {
    player.appendChild(container);
  }
}

// 监听字幕变化
function observeCaptions() {
  const captionWindow = document.querySelector('.ytp-caption-window-container');
  if (!captionWindow) return;

  translationObserver = new MutationObserver(async (mutations) => {
    if (!isTranslating) return;

    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const captionSegments = captionWindow.querySelectorAll('.ytp-caption-segment');
        
        let captionText = '';
        captionSegments.forEach(segment => {
          captionText += segment.textContent + ' ';
        });
        
        captionText = captionText.trim();
        
        if (captionText && !processedCaptions.has(captionText)) {
          processedCaptions.add(captionText);
          
          // 限制缓存大小
          if (processedCaptions.size > 50) {
            const first = processedCaptions.values().next().value;
            processedCaptions.delete(first);
          }
          
          await translateText(captionText);
        }
        
        break;
      }
    }
  });

  translationObserver.observe(captionWindow, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// 翻译文本
async function translateText(text) {
  try {
    const config = await chrome.storage.sync.get([
      'apiProvider',
      'openaiKey',
      'claudeKey',
      'grokKey',
      'openaiModel',
      'claudeModel',
      'grokModel',
      'openaiUrl',
      'claudeUrl',
      'grokUrl',
      'targetLang'
    ]);

    const targetLang = config.targetLang || 'zh-CN';
    let translation;

    if (config.apiProvider === 'openai') {
      translation = await translateWithOpenAI(text, config.openaiKey, config.openaiModel, config.openaiUrl, targetLang);
    } else if (config.apiProvider === 'claude') {
      translation = await translateWithClaude(text, config.claudeKey, config.claudeModel, config.claudeUrl, targetLang);
    } else if (config.apiProvider === 'grok') {
      translation = await translateWithGrok(text, config.grokKey, config.grokModel, config.grokUrl, targetLang);
    } else {
      throw new Error('未配置 API 提供商');
    }

    displayTranslation(translation);
  } catch (error) {
    console.error('Translation error:', error);
    displayTranslation(`翻译错误: ${error.message}`);
  }
}

// 使用 OpenAI 翻译
async function translateWithOpenAI(text, apiKey, model, customUrl, targetLang) {
  const langMap = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en': 'English',
    'ja': '日语',
    'ko': '韩语',
    'es': '西班牙语',
    'fr': '法语',
    'de': '德语',
    'ru': '俄语'
  };

  const apiUrl = customUrl || 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译助手。请将用户提供的文本翻译成${langMap[targetLang] || '简体中文'}。只需要返回翻译结果，不要添加任何解释或额外内容。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 使用 Claude 翻译
async function translateWithClaude(text, apiKey, model, customUrl, targetLang) {
  const langMap = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en': 'English',
    'ja': '日语',
    'ko': '韩语',
    'es': '西班牙语',
    'fr': '法语',
    'de': '德语',
    'ru': '俄语'
  };

  const apiUrl = customUrl || 'https://api.anthropic.com/v1/messages';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `请将以下文本翻译成${langMap[targetLang] || '简体中文'}。只需要返回翻译结果，不要添加任何解释或额外内容。\n\n${text}`
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API 请求失败');
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

// 使用 Grok 翻译
async function translateWithGrok(text, apiKey, model, customUrl, targetLang) {
  const langMap = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en': 'English',
    'ja': '日语',
    'ko': '韩语',
    'es': '西班牙语',
    'fr': '法语',
    'de': '德语',
    'ru': '俄语'
  };

  const apiUrl = customUrl || 'https://api.x.ai/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'grok-beta',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译助手。请将用户提供的文本翻译成${langMap[targetLang] || '简体中文'}。只需要返回翻译结果，不要添加任何解释或额外内容。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Grok API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 显示翻译结果
function displayTranslation(translation) {
  const container = document.getElementById('yt-translator-container');
  if (!container) return;

  container.textContent = translation;
  container.style.opacity = '1';

  // 3秒后淡出
  setTimeout(() => {
    container.style.opacity = '0.7';
  }, 3000);
}
