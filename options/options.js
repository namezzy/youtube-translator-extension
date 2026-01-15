document.addEventListener('DOMContentLoaded', async () => {
  const openaiRadio = document.getElementById('openai');
  const claudeRadio = document.getElementById('claude');
  const openaiSection = document.getElementById('openaiSection');
  const claudeSection = document.getElementById('claudeSection');
  const openaiKeyInput = document.getElementById('openaiKey');
  const claudeKeyInput = document.getElementById('claudeKey');
  const openaiModelSelect = document.getElementById('openaiModel');
  const claudeModelSelect = document.getElementById('claudeModel');
  const targetLangSelect = document.getElementById('targetLang');
  const saveBtn = document.getElementById('saveBtn');
  const saveStatus = document.getElementById('saveStatus');

  // 加载已保存的设置
  const config = await chrome.storage.sync.get([
    'apiProvider',
    'openaiKey',
    'claudeKey',
    'openaiModel',
    'claudeModel',
    'targetLang'
  ]);

  if (config.apiProvider === 'openai') {
    openaiRadio.checked = true;
    openaiSection.style.display = 'block';
  } else if (config.apiProvider === 'claude') {
    claudeRadio.checked = true;
    claudeSection.style.display = 'block';
  }

  if (config.openaiKey) openaiKeyInput.value = config.openaiKey;
  if (config.claudeKey) claudeKeyInput.value = config.claudeKey;
  if (config.openaiModel) openaiModelSelect.value = config.openaiModel;
  if (config.claudeModel) claudeModelSelect.value = config.claudeModel;
  if (config.targetLang) targetLangSelect.value = config.targetLang;

  // 切换提供商
  openaiRadio.addEventListener('change', () => {
    openaiSection.style.display = 'block';
    claudeSection.style.display = 'none';
  });

  claudeRadio.addEventListener('change', () => {
    openaiSection.style.display = 'none';
    claudeSection.style.display = 'block';
  });

  // 保存设置
  saveBtn.addEventListener('click', async () => {
    const provider = openaiRadio.checked ? 'openai' : 'claude';
    
    const settings = {
      apiProvider: provider,
      openaiKey: openaiKeyInput.value.trim(),
      claudeKey: claudeKeyInput.value.trim(),
      openaiModel: openaiModelSelect.value,
      claudeModel: claudeModelSelect.value,
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
