document.addEventListener('DOMContentLoaded', async () => {
  const openaiRadio = document.getElementById('openai');
  const claudeRadio = document.getElementById('claude');
  const grokRadio = document.getElementById('grok');
  const groqRadio = document.getElementById('groq');
  const geminiRadio = document.getElementById('gemini');
  const openaiSection = document.getElementById('openaiSection');
  const claudeSection = document.getElementById('claudeSection');
  const grokSection = document.getElementById('grokSection');
  const groqSection = document.getElementById('groqSection');
  const geminiSection = document.getElementById('geminiSection');
  const openaiKeyInput = document.getElementById('openaiKey');
  const claudeKeyInput = document.getElementById('claudeKey');
  const grokKeyInput = document.getElementById('grokKey');
  const groqKeyInput = document.getElementById('groqKey');
  const geminiKeyInput = document.getElementById('geminiKey');
  const openaiModelSelect = document.getElementById('openaiModel');
  const claudeModelSelect = document.getElementById('claudeModel');
  const grokModelSelect = document.getElementById('grokModel');
  const groqModelSelect = document.getElementById('groqModel');
  const geminiModelSelect = document.getElementById('geminiModel');
  const openaiUrlInput = document.getElementById('openaiUrl');
  const claudeUrlInput = document.getElementById('claudeUrl');
  const grokUrlInput = document.getElementById('grokUrl');
  const groqUrlInput = document.getElementById('groqUrl');
  const geminiUrlInput = document.getElementById('geminiUrl');
  const targetLangSelect = document.getElementById('targetLang');
  const saveBtn = document.getElementById('saveBtn');
  const saveStatus = document.getElementById('saveStatus');

  // 加载已保存的设置
  const config = await chrome.storage.sync.get([
    'apiProvider',
    'openaiKey',
    'claudeKey',
    'grokKey',
    'groqKey',
    'geminiKey',
    'openaiModel',
    'claudeModel',
    'grokModel',
    'groqModel',
    'geminiModel',
    'openaiUrl',
    'claudeUrl',
    'grokUrl',
    'groqUrl',
    'geminiUrl',
    'targetLang'
  ]);

  if (config.apiProvider === 'openai') {
    openaiRadio.checked = true;
    openaiSection.style.display = 'block';
  } else if (config.apiProvider === 'claude') {
    claudeRadio.checked = true;
    claudeSection.style.display = 'block';
  } else if (config.apiProvider === 'grok') {
    grokRadio.checked = true;
    grokSection.style.display = 'block';
  } else if (config.apiProvider === 'groq') {
    groqRadio.checked = true;
    groqSection.style.display = 'block';
  } else if (config.apiProvider === 'gemini') {
    geminiRadio.checked = true;
    geminiSection.style.display = 'block';
  }

  if (config.openaiKey) openaiKeyInput.value = config.openaiKey;
  if (config.claudeKey) claudeKeyInput.value = config.claudeKey;
  if (config.grokKey) grokKeyInput.value = config.grokKey;
  if (config.groqKey) groqKeyInput.value = config.groqKey;
  if (config.geminiKey) geminiKeyInput.value = config.geminiKey;
  if (config.openaiModel) openaiModelSelect.value = config.openaiModel;
  if (config.claudeModel) claudeModelSelect.value = config.claudeModel;
  if (config.grokModel) grokModelSelect.value = config.grokModel;
  if (config.groqModel) groqModelSelect.value = config.groqModel;
  if (config.geminiModel) geminiModelSelect.value = config.geminiModel;
  if (config.openaiUrl) openaiUrlInput.value = config.openaiUrl;
  if (config.claudeUrl) claudeUrlInput.value = config.claudeUrl;
  if (config.grokUrl) grokUrlInput.value = config.grokUrl;
  if (config.groqUrl) groqUrlInput.value = config.groqUrl;
  if (config.geminiUrl) geminiUrlInput.value = config.geminiUrl;
  if (config.targetLang) targetLangSelect.value = config.targetLang;

  // 切换提供商
  openaiRadio.addEventListener('change', () => {
    openaiSection.style.display = 'block';
    claudeSection.style.display = 'none';
    grokSection.style.display = 'none';
    groqSection.style.display = 'none';
    geminiSection.style.display = 'none';
  });

  claudeRadio.addEventListener('change', () => {
    openaiSection.style.display = 'none';
    claudeSection.style.display = 'block';
    grokSection.style.display = 'none';
    groqSection.style.display = 'none';
    geminiSection.style.display = 'none';
  });

  grokRadio.addEventListener('change', () => {
    openaiSection.style.display = 'none';
    claudeSection.style.display = 'none';
    grokSection.style.display = 'block';
    groqSection.style.display = 'none';
    geminiSection.style.display = 'none';
  });

  groqRadio.addEventListener('change', () => {
    openaiSection.style.display = 'none';
    claudeSection.style.display = 'none';
    grokSection.style.display = 'none';
    groqSection.style.display = 'block';
    geminiSection.style.display = 'none';
  });

  geminiRadio.addEventListener('change', () => {
    openaiSection.style.display = 'none';
    claudeSection.style.display = 'none';
    grokSection.style.display = 'none';
    groqSection.style.display = 'none';
    geminiSection.style.display = 'block';
  });

  // 保存设置
  saveBtn.addEventListener('click', async () => {
    let provider = 'openai';
    if (claudeRadio.checked) provider = 'claude';
    if (grokRadio.checked) provider = 'grok';
    if (groqRadio.checked) provider = 'groq';
    if (geminiRadio.checked) provider = 'gemini';
    
    const settings = {
      apiProvider: provider,
      openaiKey: openaiKeyInput.value.trim(),
      claudeKey: claudeKeyInput.value.trim(),
      grokKey: grokKeyInput.value.trim(),
      groqKey: groqKeyInput.value.trim(),
      geminiKey: geminiKeyInput.value.trim(),
      openaiModel: openaiModelSelect.value,
      claudeModel: claudeModelSelect.value,
      grokModel: grokModelSelect.value,
      groqModel: groqModelSelect.value,
      geminiModel: geminiModelSelect.value,
      openaiUrl: openaiUrlInput.value.trim(),
      claudeUrl: claudeUrlInput.value.trim(),
      grokUrl: grokUrlInput.value.trim(),
      groqUrl: groqUrlInput.value.trim(),
      geminiUrl: geminiUrlInput.value.trim(),
      targetLang: targetLangSelect.value
    };

    // 验证
    if (provider === 'openai' && !settings.openaiKey) {
      showSaveStatus('请输入 OpenAI API Key', false);
      return;
    }

    if (provider === 'claude' && !settings.claudeKey) {
      showSaveStatus('请输入 Claude API Key', false);
      return;
    }

    if (provider === 'grok' && !settings.grokKey) {
      showSaveStatus('请输入 Grok API Key', false);
      return;
    }

    if (provider === 'groq' && !settings.groqKey) {
      showSaveStatus('请输入 Groq API Key', false);
      return;
    }

    if (provider === 'gemini' && !settings.geminiKey) {
      showSaveStatus('请输入 Gemini API Key', false);
      return;
    }

    await chrome.storage.sync.set(settings);
    showSaveStatus('设置已保存', true);
  });

  function showSaveStatus(message, success) {
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${success ? 'success' : ''}`;
    saveStatus.style.display = 'inline-block';
    
    setTimeout(() => {
      saveStatus.style.display = 'none';
    }, 3000);
  }
});
