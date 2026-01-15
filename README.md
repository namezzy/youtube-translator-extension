# YouTube Video Translator - Chrome 浏览器插件

🌐 一个支持 OpenAI、Claude 和 Grok API 的 YouTube 视频实时字幕翻译插件

## ✨ 功能特性

- ✅ 实时翻译 YouTube 视频字幕
- ✅ 支持 OpenAI GPT 系列模型（GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-3.5 等）
- ✅ 支持 Claude 系列模型（Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus 等）
- ✅ 支持 Grok 系列模型（Grok Beta, Grok 2 Latest, Grok 2 等）
- ✅ 支持自定义 API URL（代理或第三方兼容接口）
- ✅ 支持多种目标语言翻译（中文简繁体、英语、日语、韩语等）
- ✅ 自动检测字幕变化并实时翻译
- ✅ 优雅的翻译显示界面
- ✅ 简单易用的配置界面

## 📦 安装方法

### 1. 下载插件

将整个 `youtube-translator-extension` 文件夹下载到本地。

### 2. 准备图标文件

插件需要图标文件才能正常加载。你可以：

**选项 A：使用在线工具创建图标**
- 访问 [Favicon Generator](https://favicon.io/) 或类似工具
- 创建 16x16、48x48、128x128 三个尺寸的 PNG 图标
- 将它们保存到 `icons` 文件夹，命名为 `icon16.png`、`icon48.png`、`icon128.png`

**选项 B：使用简单的蓝色方块作为临时图标**
- 下载任意蓝色图标并调整为对应尺寸
- 或使用 `icons/icon.svg` 转换为 PNG 格式

### 3. 在 Chrome 中加载插件

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 启用右上角的 **"开发者模式"**
4. 点击 **"加载已解压的扩展程序"**
5. 选择 `youtube-translator-extension` 文件夹
6. 插件安装完成！

## ⚙️ 配置说明

### 1. 首次配置

安装后会自动打开设置页面，或者点击插件图标后选择 **"⚙️ 配置 API 设置"**。

### 2. 选择 API 提供商

#### 使用 OpenAI
1. 选择 **OpenAI** 单选按钮
2. 输入你的 OpenAI API Key（从 [OpenAI Platform](https://platform.openai.com/api-keys) 获取）
3. 选择模型：
   - **GPT-4o**（推荐）- 最新最强模型
   - **GPT-4o-mini**（快速）- 更快速且经济
   - **GPT-4 Turbo** - 强大的翻译能力
   - **GPT-3.5 Turbo**（经济）- 经济实惠
4. （可选）自定义 API URL - 留空使用默认地址，支持代理或第三方兼容接口

#### 使用 Claude
1. 选择 **Claude (Anthropic)** 单选按钮
2. 输入你的 Claude API Key（从 [Anthropic Console](https://console.anthropic.com/settings/keys) 获取）
3. 选择模型：
   - **Claude 3.5 Sonnet**（推荐）- 性能优异
   - **Claude 3.5 Haiku**（快速）- 快速响应
   - **Claude 3 Opus** - 最高质量
   - **Claude 3 Haiku**（经济）- 经济型选择
4. （可选）自定义 API URL - 留空使用默认地址，支持代理或第三方兼容接口

#### 使用 Grok
1. 选择 **Grok (xAI)** 单选按钮
2. 输入你的 Grok API Key（从 [xAI Console](https://console.x.ai/) 获取）
3. 选择模型：
   - **Grok Beta**（推荐）- 最新测试版
   - **Grok 2 Latest** - 最新稳定版
   - **Grok 2 (1212)** - 特定版本
4. （可选）自定义 API URL - 留空使用默认地址，支持代理或第三方兼容接口

### 3. 选择目标语言

支持翻译到：
- 简体中文
- 繁体中文
- 英语
- 日语
- 韩语
- 西班牙语
- 法语
- 德语
- 俄语

### 4. 保存设置

点击 **"保存设置"** 按钮完成配置。

## 🚀 使用方法

1. **打开 YouTube 视频**
   - 访问任意 YouTube 视频页面
   - 确保视频有字幕（自动字幕或人工字幕均可）

2. **启动翻译**
   - 点击浏览器工具栏中的插件图标
   - 点击 **"开始翻译"** 按钮

3. **查看翻译**
   - 翻译文本会显示在视频下方
   - 半透明黑色背景，自动跟随字幕更新

4. **停止翻译**
   - 再次点击插件图标
   - 点击 **"停止翻译"** 按钮

## 📁 项目结构

```
youtube-translator-extension/
├── manifest.json              # 插件清单文件
├── README.md                  # 说明文档
├── popup/                     # 弹出窗口
│   ├── popup.html            # 弹出窗口 HTML
│   └── popup.js              # 弹出窗口逻辑
├── options/                   # 设置页面
│   ├── options.html          # 设置页面 HTML
│   └── options.js            # 设置页面逻辑
├── scripts/                   # 脚本文件
│   ├── content.js            # 内容脚本（核心翻译逻辑）
│   └── background.js         # 后台服务
├── styles/                    # 样式文件
│   └── content.css           # 内容样式
└── icons/                     # 图标文件
    ├── icon16.png            # 16x16 图标
    ├── icon48.png            # 48x48 图标
    ├── icon128.png           # 128x128 图标
    └── icon.svg              # SVG 图标源文件
```

## 🔧 技术实现

- **Manifest V3**：使用最新的 Chrome 扩展 API
- **MutationObserver**：实时监听字幕变化
- **OpenAI API**：使用 Chat Completions API 进行翻译
- **Claude API**：使用 Messages API 进行翻译
- **Chrome Storage API**：安全存储配置信息

## ⚠️ 注意事项

1. **API Key 安全**
   - API Key 存储在浏览器的本地存储中
   - 不会上传到任何服务器
   - 请妥善保管你的 API Key

2. **API 费用**
   - 使用 OpenAI 和 Claude API 会产生费用
   - 建议选择经济型模型以降低成本
   - 可在各自平台查看用量和费用

3. **字幕要求**
   - 视频必须有字幕（自动生成或人工添加）
   - 如果没有字幕，插件会尝试自动开启

4. **翻译质量**
   - 翻译质量取决于选择的模型
   - GPT-4o 和 Claude 3.5 Sonnet 通常提供最佳质量
   - 可根据需求在质量和成本间平衡

## 🔄 更新日志

### v1.0.0 (2026-01-15)
- ✨ 初始版本发布
- ✅ 支持 OpenAI GPT 系列模型
- ✅ 支持 Claude 3.5 系列模型
- ✅ 实时字幕翻译
- ✅ 多语言支持
- ✅ 友好的用户界面

## 💡 常见问题

**Q: 为什么翻译没有显示？**
A: 请检查：
- 视频是否有字幕
- API Key 是否正确配置
- 网络连接是否正常
- 浏览器控制台是否有错误信息

**Q: 翻译速度慢怎么办？**
A: 可以：
- 切换到更快的模型（如 GPT-4o-mini 或 Claude 3.5 Haiku）
- 检查网络连接
- 确认 API 服务状态

**Q: 如何更换 API 提供商？**
A: 进入设置页面，选择不同的提供商并输入对应的 API Key 即可。

**Q: 支持其他浏览器吗？**
A: 目前主要支持 Chrome，理论上也支持基于 Chromium 的浏览器（如 Edge、Brave 等）。

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，欢迎反馈。

---

**Enjoy translating YouTube videos! 🎉**
