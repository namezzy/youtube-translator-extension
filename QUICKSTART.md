# 快速开始指南

## 第一步：安装插件

1. 打开 Chrome 浏览器
2. 地址栏输入：`chrome://extensions/`
3. 打开右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `youtube-translator-extension` 文件夹

## 第二步：配置 API

### 选项 A：使用 OpenAI

1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 点击插件图标 → "⚙️ 配置 API 设置"
4. 选择 "OpenAI"
5. 粘贴你的 API Key
6. 选择模型（推荐 GPT-4o-mini，速度快且经济）
7. 点击"保存设置"

### 选项 B：使用 Claude

1. 访问 https://console.anthropic.com/settings/keys
2. 创建新的 API Key
3. 点击插件图标 → "⚙️ 配置 API 设置"
4. 选择 "Claude (Anthropic)"
5. 粘贴你的 API Key
6. 选择模型（推荐 Claude 3.5 Haiku，快速且经济）
7. 点击"保存设置"

## 第三步：开始使用

1. 打开任意 YouTube 视频（确保有字幕）
2. 点击浏览器工具栏的插件图标
3. 点击"开始翻译"按钮
4. 观看视频时，翻译会自动显示在视频下方

## 提示

- 💡 第一次使用建议选择经济型模型测试
- 💡 翻译质量：GPT-4o > GPT-4o-mini > GPT-3.5-turbo
- 💡 Claude 3.5 Sonnet 提供最佳翻译质量
- 💡 可随时在设置中切换 API 提供商和模型
- 💡 支持 9 种目标语言翻译

## 费用参考（截至 2024 年）

### OpenAI 定价
- GPT-4o-mini: ~$0.15 / 1M tokens（最经济）
- GPT-4o: ~$5 / 1M tokens
- GPT-3.5-turbo: ~$0.5 / 1M tokens

### Claude 定价
- Claude 3.5 Haiku: ~$0.25 / 1M tokens（快速）
- Claude 3.5 Sonnet: ~$3 / 1M tokens（推荐）
- Claude 3 Opus: ~$15 / 1M tokens（高质量）

*注：实际费用以官方平台为准，翻译字幕通常消耗很少的 tokens*

## 常见问题

**Q: 没有看到翻译？**
- 确保视频有字幕（点击 CC 按钮）
- 检查 API Key 是否正确
- 打开控制台（F12）查看错误信息

**Q: 翻译太慢？**
- 切换到 mini/haiku 等快速模型
- 检查网络连接

**Q: 如何停止翻译？**
- 再次点击插件图标，点击"停止翻译"

---

**开始享受无障碍的 YouTube 观看体验！🎉**
