// YouTube 字幕翻译内容脚本
let isTranslating = false;
let translationObserver = null;
let processedCaptions = new Set();
let captionHistory = [];

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
  } else if (request.action === 'summarizeVideo') {
    summarizeVideo().then(result => {
      sendResponse(result);
    });
    return true;
  } else if (request.action === 'downloadSubtitles') {
    downloadSubtitles().then(result => {
      sendResponse(result);
    });
    return true;
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
      'groqKey',
      'geminiKey',
      'customKey',
      'openaiModel',
      'claudeModel',
      'grokModel',
      'groqModel',
      'geminiModel',
      'customModel',
      'openaiCustomModel',
      'claudeCustomModel',
      'grokCustomModel',
      'groqCustomModel',
      'geminiCustomModel',
      'openaiUrl',
      'claudeUrl',
      'grokUrl',
      'groqUrl',
      'geminiUrl',
      'customUrl',
      'customType',
      'targetLang'
    ]);

    const targetLang = config.targetLang || 'zh-CN';
    let translation;

    if (config.apiProvider === 'openai') {
      const model = config.openaiModel === 'custom' ? config.openaiCustomModel : config.openaiModel;
      translation = await translateWithOpenAI(text, config.openaiKey, model, config.openaiUrl, targetLang);
    } else if (config.apiProvider === 'claude') {
      const model = config.claudeModel === 'custom' ? config.claudeCustomModel : config.claudeModel;
      translation = await translateWithClaude(text, config.claudeKey, model, config.claudeUrl, targetLang);
    } else if (config.apiProvider === 'grok') {
      const model = config.grokModel === 'custom' ? config.grokCustomModel : config.grokModel;
      translation = await translateWithGrok(text, config.grokKey, model, config.grokUrl, targetLang);
    } else if (config.apiProvider === 'groq') {
      const model = config.groqModel === 'custom' ? config.groqCustomModel : config.groqModel;
      translation = await translateWithGroq(text, config.groqKey, model, config.groqUrl, targetLang);
    } else if (config.apiProvider === 'gemini') {
      const model = config.geminiModel === 'custom' ? config.geminiCustomModel : config.geminiModel;
      translation = await translateWithGemini(text, config.geminiKey, model, config.geminiUrl, targetLang);
    } else if (config.apiProvider === 'custom') {
      translation = await translateWithCustom(text, config.customKey, config.customModel, config.customUrl, config.customType, targetLang);
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

// 使用 Groq 翻译
async function translateWithGroq(text, apiKey, model, customUrl, targetLang) {
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

  const apiUrl = customUrl || 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
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
    throw new Error(error.error?.message || 'Groq API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 使用 Gemini 翻译
async function translateWithGemini(text, apiKey, model, customUrl, targetLang) {
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

  const baseUrl = customUrl || 'https://generativelanguage.googleapis.com/v1beta';
  const modelName = model || 'gemini-2.0-flash-exp';
  const apiUrl = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `请将以下文本翻译成${langMap[targetLang] || '简体中文'}。只需要返回翻译结果，不要添加任何解释或额外内容。\n\n${text}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API 请求失败');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// 使用自定义 AI 翻译
async function translateWithCustom(text, apiKey, model, apiUrl, apiType, targetLang) {
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

  if (!apiUrl) {
    throw new Error('未配置自定义 API URL');
  }

  if (!model) {
    throw new Error('未配置模型名称');
  }

  // 根据 API 类型选择不同的请求格式
  if (apiType === 'gemini') {
    // Gemini 格式
    const url = apiKey ? `${apiUrl}?key=${apiKey}` : apiUrl;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `请将以下文本翻译成${langMap[targetLang] || '简体中文'}。只需要返回翻译结果，不要添加任何解释或额外内容。\n\n${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '自定义 API 请求失败');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } else {
    // OpenAI 兼容格式（默认）
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
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
      throw new Error(error.error?.message || '自定义 API 请求失败');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
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

// 总结视频内容
async function summarizeVideo() {
  try {
    // 获取视频字幕文本
    const subtitlesText = await extractSubtitles();
    
    if (!subtitlesText) {
      return { success: false, message: '无法获取视频字幕，请确保视频有字幕' };
    }

    // 生成总结
    const summary = await generateSummary(subtitlesText);
    
    // 显示总结
    displaySummary(summary);
    
    return { success: true };
  } catch (error) {
    console.error('Summary error:', error);
    return { success: false, message: `总结失败: ${error.message}` };
  }
}

// 提取视频字幕
async function extractSubtitles() {
  try {
    // 方法1: 尝试从 YouTube API 获取字幕
    const videoId = getVideoId();
    if (!videoId) return null;

    // 获取播放器响应数据
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
      const tracks = ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
      if (tracks.length > 0) {
        const captionUrl = tracks[0].baseUrl;
        const response = await fetch(captionUrl);
        const xmlText = await response.text();
        return parseSubtitleXML(xmlText);
      }
    }

    // 方法2: 从当前页面的字幕元素收集
    return collectVisibleSubtitles();
  } catch (error) {
    console.error('Extract subtitles error:', error);
    return collectVisibleSubtitles();
  }
}

// 获取视频ID
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

// 解析字幕XML
function parseSubtitleXML(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const textElements = xmlDoc.getElementsByTagName('text');
  
  let subtitles = [];
  for (let elem of textElements) {
    const text = elem.textContent.replace(/&amp;#39;/g, "'")
                                 .replace(/&amp;quot;/g, '"')
                                 .replace(/&amp;/g, '&')
                                 .replace(/<[^>]*>/g, '');
    if (text.trim()) {
      subtitles.push(text.trim());
    }
  }
  
  return subtitles.join(' ');
}

// 收集可见字幕（备用方案）
function collectVisibleSubtitles() {
  if (captionHistory.length > 0) {
    return captionHistory.join(' ');
  }
  return null;
}

// 生成视频总结
async function generateSummary(subtitlesText) {
  const config = await chrome.storage.sync.get([
    'apiProvider',
    'openaiKey',
    'claudeKey',
    'grokKey',
    'groqKey',
    'geminiKey',
    'customKey',
    'openaiModel',
    'claudeModel',
    'grokModel',
    'groqModel',
    'geminiModel',
    'customModel',
    'openaiCustomModel',
    'claudeCustomModel',
    'grokCustomModel',
    'groqCustomModel',
    'geminiCustomModel',
    'openaiUrl',
    'claudeUrl',
    'grokUrl',
    'groqUrl',
    'geminiUrl',
    'customUrl',
    'customType',
    'targetLang'
  ]);

  const targetLang = config.targetLang || 'zh-CN';
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

  const summaryPrompt = `请对以下视频字幕内容进行总结分析，用${langMap[targetLang] || '简体中文'}输出。要求：

1. 首先用一句话概括视频的中心观点
2. 然后将内容分成3-5个主要部分，每个部分包括：
   - 部分标题
   - 该部分的核心要点（2-3句话）

请使用清晰的结构化格式输出，使用标题、序号等方式组织内容。

视频字幕内容：
${subtitlesText.substring(0, 8000)}`;

  let summary;
  if (config.apiProvider === 'openai') {
    const model = config.openaiModel === 'custom' ? config.openaiCustomModel : config.openaiModel;
    summary = await callOpenAIAPI(summaryPrompt, config.openaiKey, model, config.openaiUrl);
  } else if (config.apiProvider === 'claude') {
    const model = config.claudeModel === 'custom' ? config.claudeCustomModel : config.claudeModel;
    summary = await callClaudeAPI(summaryPrompt, config.claudeKey, model, config.claudeUrl);
  } else if (config.apiProvider === 'grok') {
    const model = config.grokModel === 'custom' ? config.grokCustomModel : config.grokModel;
    summary = await callGrokAPI(summaryPrompt, config.grokKey, model, config.grokUrl);
  } else if (config.apiProvider === 'groq') {
    const model = config.groqModel === 'custom' ? config.groqCustomModel : config.groqModel;
    summary = await callGroqAPI(summaryPrompt, config.groqKey, model, config.groqUrl);
  } else if (config.apiProvider === 'gemini') {
    const model = config.geminiModel === 'custom' ? config.geminiCustomModel : config.geminiModel;
    summary = await callGeminiAPI(summaryPrompt, config.geminiKey, model, config.geminiUrl);
  } else if (config.apiProvider === 'custom') {
    summary = await callCustomAPI(summaryPrompt, config.customKey, config.customModel, config.customUrl, config.customType);
  } else {
    throw new Error('未配置 API 提供商');
  }

  return summary;
}

// 调用 OpenAI API
async function callOpenAIAPI(prompt, apiKey, model, customUrl) {
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
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 调用 Claude API
async function callClaudeAPI(prompt, apiKey, model, customUrl) {
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
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API 请求失败');
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

// 调用 Grok API
async function callGrokAPI(prompt, apiKey, model, customUrl) {
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
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Grok API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 调用 Groq API
async function callGroqAPI(prompt, apiKey, model, customUrl) {
  const apiUrl = customUrl || 'https://api.groq.com/openai/v1/chat/completions';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// 调用 Gemini API
async function callGeminiAPI(prompt, apiKey, model, customUrl) {
  const baseUrl = customUrl || 'https://generativelanguage.googleapis.com/v1beta';
  const modelName = model || 'gemini-2.0-flash-exp';
  const apiUrl = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API 请求失败');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

// 调用自定义 API
async function callCustomAPI(prompt, apiKey, model, apiUrl, apiType) {
  if (!apiUrl) {
    throw new Error('未配置自定义 API URL');
  }

  if (!model) {
    throw new Error('未配置模型名称');
  }

  if (apiType === 'gemini') {
    const url = apiKey ? `${apiUrl}?key=${apiKey}` : apiUrl;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '自定义 API 请求失败');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } else {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '自定义 API 请求失败');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

// 显示视频总结
function displaySummary(summary) {
  // 移除旧的总结容器
  let summaryContainer = document.getElementById('yt-video-summary-container');
  if (summaryContainer) {
    summaryContainer.remove();
  }

  // 创建新的总结容器
  summaryContainer = document.createElement('div');
  summaryContainer.id = 'yt-video-summary-container';
  summaryContainer.className = 'yt-summary-box';

  // 创建关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.className = 'yt-summary-close';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => summaryContainer.remove();

  // 创建标题
  const title = document.createElement('h3');
  title.className = 'yt-summary-title';
  title.textContent = '📝 视频内容总结';

  // 创建内容
  const content = document.createElement('div');
  content.className = 'yt-summary-content';
  content.innerHTML = formatSummary(summary);

  summaryContainer.appendChild(closeBtn);
  summaryContainer.appendChild(title);
  summaryContainer.appendChild(content);

  // 插入到视频下方
  const secondary = document.querySelector('#secondary');
  if (secondary) {
    secondary.insertBefore(summaryContainer, secondary.firstChild);
  } else {
    document.body.appendChild(summaryContainer);
  }
}

// 格式化总结内容
function formatSummary(summary) {
  // 将文本转换为 HTML，保持换行和格式
  return summary
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(#{1,3})\s+(.+)$/gm, (match, hashes, text) => {
      const level = hashes.length;
      return `<h${level + 2} style="margin-top: 15px; margin-bottom: 5px;">${text}</h${level + 2}>`;
    })
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin-left: 20px; margin-top: 8px;"><strong>$1.</strong> $2</div>');
}

// 在观察字幕时同时记录历史
const originalObserveCaptions = observeCaptions;
observeCaptions = function() {
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
          
          // 保存到历史记录
          captionHistory.push(captionText);
          if (captionHistory.length > 100) {
            captionHistory.shift();
          }
          
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
};

// 下载字幕对照功能
async function downloadSubtitles() {
  try {
    // 获取视频字幕文本
    const subtitlesData = await extractSubtitlesWithTimestamps();
    
    if (!subtitlesData || subtitlesData.length === 0) {
      return { success: false, message: '无法获取视频字幕，请确保视频有字幕' };
    }

    // 翻译所有字幕
    const translatedData = await translateSubtitles(subtitlesData);
    
    // 显示对照界面
    displaySubtitleComparison(subtitlesData, translatedData);
    
    return { success: true };
  } catch (error) {
    console.error('Download subtitles error:', error);
    return { success: false, message: `处理失败: ${error.message}` };
  }
}

// 提取带时间戳的字幕
async function extractSubtitlesWithTimestamps() {
  try {
    const videoId = getVideoId();
    if (!videoId) return null;

    // 获取播放器响应数据
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
      const tracks = ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
      if (tracks.length > 0) {
        const captionUrl = tracks[0].baseUrl;
        const response = await fetch(captionUrl);
        const xmlText = await response.text();
        return parseSubtitleXMLWithTimestamps(xmlText);
      }
    }

    return null;
  } catch (error) {
    console.error('Extract subtitles with timestamps error:', error);
    return null;
  }
}

// 解析带时间戳的字幕XML
function parseSubtitleXMLWithTimestamps(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const textElements = xmlDoc.getElementsByTagName('text');
  
  let subtitles = [];
  for (let elem of textElements) {
    const text = elem.textContent
      .replace(/&amp;#39;/g, "'")
      .replace(/&amp;quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/<[^>]*>/g, '')
      .trim();
    
    const start = parseFloat(elem.getAttribute('start') || '0');
    const duration = parseFloat(elem.getAttribute('dur') || '0');
    
    if (text) {
      subtitles.push({
        start: start,
        end: start + duration,
        text: text
      });
    }
  }
  
  return subtitles;
}

// 翻译所有字幕
async function translateSubtitles(subtitlesData) {
  const config = await chrome.storage.sync.get([
    'apiProvider',
    'openaiKey',
    'claudeKey',
    'grokKey',
    'groqKey',
    'geminiKey',
    'customKey',
    'openaiModel',
    'claudeModel',
    'grokModel',
    'groqModel',
    'geminiModel',
    'customModel',
    'openaiCustomModel',
    'claudeCustomModel',
    'grokCustomModel',
    'groqCustomModel',
    'geminiCustomModel',
    'openaiUrl',
    'claudeUrl',
    'grokUrl',
    'groqUrl',
    'geminiUrl',
    'customUrl',
    'customType',
    'targetLang'
  ]);

  const targetLang = config.targetLang || 'zh-CN';
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

  // 将字幕分批处理，每批10条
  const batchSize = 10;
  const translatedData = [];
  
  for (let i = 0; i < subtitlesData.length; i += batchSize) {
    const batch = subtitlesData.slice(i, i + batchSize);
    const batchTexts = batch.map(item => item.text).join('\n');
    
    const prompt = `请将以下字幕逐行翻译成${langMap[targetLang] || '简体中文'}。保持原有的行数和顺序，每行一个翻译结果，不要添加序号或其他内容。

${batchTexts}`;

    try {
      let translation;
      if (config.apiProvider === 'openai') {
        const model = config.openaiModel === 'custom' ? config.openaiCustomModel : config.openaiModel;
        translation = await callOpenAIAPI(prompt, config.openaiKey, model, config.openaiUrl);
      } else if (config.apiProvider === 'claude') {
        const model = config.claudeModel === 'custom' ? config.claudeCustomModel : config.claudeModel;
        translation = await callClaudeAPI(prompt, config.claudeKey, model, config.claudeUrl);
      } else if (config.apiProvider === 'grok') {
        const model = config.grokModel === 'custom' ? config.grokCustomModel : config.grokModel;
        translation = await callGrokAPI(prompt, config.grokKey, model, config.grokUrl);
      } else if (config.apiProvider === 'groq') {
        const model = config.groqModel === 'custom' ? config.groqCustomModel : config.groqModel;
        translation = await callGroqAPI(prompt, config.groqKey, model, config.groqUrl);
      } else if (config.apiProvider === 'gemini') {
        const model = config.geminiModel === 'custom' ? config.geminiCustomModel : config.geminiModel;
        translation = await callGeminiAPI(prompt, config.geminiKey, model, config.geminiUrl);
      } else if (config.apiProvider === 'custom') {
        translation = await callCustomAPI(prompt, config.customKey, config.customModel, config.customUrl, config.customType);
      } else {
        throw new Error('未配置 API 提供商');
      }

      const translatedLines = translation.split('\n').filter(line => line.trim());
      
      for (let j = 0; j < batch.length; j++) {
        translatedData.push({
          ...batch[j],
          translation: translatedLines[j] || batch[j].text
        });
      }
    } catch (error) {
      console.error('Translation batch error:', error);
      // 如果翻译失败，使用原文
      batch.forEach(item => {
        translatedData.push({
          ...item,
          translation: `[翻译失败] ${item.text}`
        });
      });
    }
  }

  return translatedData;
}

// 显示字幕对照界面
function displaySubtitleComparison(originalData, translatedData) {
  // 移除旧的对照容器
  let comparisonContainer = document.getElementById('yt-subtitle-comparison-container');
  if (comparisonContainer) {
    comparisonContainer.remove();
  }

  // 创建全屏对照容器
  comparisonContainer = document.createElement('div');
  comparisonContainer.id = 'yt-subtitle-comparison-container';
  comparisonContainer.className = 'yt-subtitle-comparison';

  // 创建顶部工具栏
  const toolbar = document.createElement('div');
  toolbar.className = 'yt-subtitle-toolbar';
  
  const title = document.createElement('h2');
  title.textContent = '📥 字幕对照';
  
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'yt-subtitle-button-group';
  
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '💾 下载为TXT';
  downloadBtn.className = 'yt-subtitle-btn';
  downloadBtn.onclick = () => downloadSubtitlesAsTxt(translatedData);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ 关闭';
  closeBtn.className = 'yt-subtitle-btn yt-subtitle-close-btn';
  closeBtn.onclick = () => comparisonContainer.remove();
  
  buttonGroup.appendChild(downloadBtn);
  buttonGroup.appendChild(closeBtn);
  toolbar.appendChild(title);
  toolbar.appendChild(buttonGroup);

  // 创建内容区域
  const contentArea = document.createElement('div');
  contentArea.className = 'yt-subtitle-content';

  // 左侧原文
  const leftPanel = document.createElement('div');
  leftPanel.className = 'yt-subtitle-panel yt-subtitle-left';
  const leftTitle = document.createElement('h3');
  leftTitle.textContent = '原文';
  leftPanel.appendChild(leftTitle);
  
  const leftContent = document.createElement('div');
  leftContent.className = 'yt-subtitle-text';
  translatedData.forEach((item, index) => {
    const line = document.createElement('div');
    line.className = 'yt-subtitle-line';
    line.innerHTML = `
      <span class="yt-subtitle-time">${formatTime(item.start)}</span>
      <span class="yt-subtitle-original">${escapeHtml(item.text)}</span>
    `;
    leftContent.appendChild(line);
  });
  leftPanel.appendChild(leftContent);

  // 右侧译文
  const rightPanel = document.createElement('div');
  rightPanel.className = 'yt-subtitle-panel yt-subtitle-right';
  const rightTitle = document.createElement('h3');
  rightTitle.textContent = '译文';
  rightPanel.appendChild(rightTitle);
  
  const rightContent = document.createElement('div');
  rightContent.className = 'yt-subtitle-text';
  translatedData.forEach((item, index) => {
    const line = document.createElement('div');
    line.className = 'yt-subtitle-line';
    line.innerHTML = `
      <span class="yt-subtitle-time">${formatTime(item.start)}</span>
      <span class="yt-subtitle-translated">${escapeHtml(item.translation)}</span>
    `;
    rightContent.appendChild(line);
  });
  rightPanel.appendChild(rightContent);

  contentArea.appendChild(leftPanel);
  contentArea.appendChild(rightPanel);

  comparisonContainer.appendChild(toolbar);
  comparisonContainer.appendChild(contentArea);

  document.body.appendChild(comparisonContainer);
}

// 格式化时间
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// HTML转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 下载为TXT文件
function downloadSubtitlesAsTxt(translatedData) {
  let content = '字幕对照\n';
  content += '=' .repeat(60) + '\n\n';
  
  translatedData.forEach((item, index) => {
    content += `[${formatTime(item.start)} - ${formatTime(item.end)}]\n`;
    content += `原文: ${item.text}\n`;
    content += `译文: ${item.translation}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `字幕对照_${getVideoId()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
