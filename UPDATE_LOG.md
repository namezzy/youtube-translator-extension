# 更新日志

## v1.3.0 - 2026-01-15

### 新增功能

#### 1. 自定义 AI 支持 🎉
- ✅ 支持配置任意兼容 OpenAI 或 Gemini 格式的 AI 服务
- ✅ 可自定义 AI 名称、API Key、API URL、模型名称
- ✅ 支持两种 API 格式：OpenAI 兼容格式和 Gemini 格式
- ✅ 完美支持国内主流 AI 服务：
  - DeepSeek、通义千问、Kimi、零一万物、智谱清言、百川智能等

#### 2. 所有 AI 提供商支持自定义模型名称 ⭐
- ✅ OpenAI、Claude、Grok、Groq、Gemini 均新增"自定义模型"选项
- ✅ 可输入任意模型名称，支持最新发布的模型
- ✅ 适配官方未列出的实验性模型或特定版本
- ✅ 方便测试新模型或使用第三方兼容服务的特定模型

#### 3. 灵活的配置选项
- ✅ API Key 可选（部分服务不需要）
- ✅ 支持自定义 API URL
- ✅ 支持自定义模型名称
- ✅ 智能识别 API 格式类型

### 使用说明

#### 使用自定义模型名称
所有 AI 提供商（OpenAI、Claude、Grok、Groq、Gemini）的模型下拉菜单中都增加了"自定义模型"选项：

1. 在模型下拉菜单中选择"自定义模型"
2. 会显示一个输入框，输入您想使用的模型名称
3. 保存设置

**使用场景：**
- 使用官方最新发布但列表中未更新的模型
- 使用实验性或测试版模型
- 使用第三方兼容服务的特定模型名称
- 使用带有特定版本号的模型

**示例：**
- OpenAI: `gpt-4-0125-preview`, `gpt-4.5-turbo`
- Claude: `claude-3-5-sonnet-latest`, `claude-4-opus`
- Grok: `grok-3-beta`, `grok-2-mini`
- Groq: `llama-3.2-90b-vision`, `mixtral-8x22b`
- Gemini: `gemini-2.0-pro`, `gemini-exp-1206`

#### 配置自定义 AI
1. 在插件设置中选择 "自定义 AI"
2. 填写 AI 名称（如：DeepSeek）
3. 输入 API Key（如果需要）
4. 输入完整的 API URL
5. 输入模型名称
6. 选择 API 格式类型
7. 保存设置

**示例配置：**

**DeepSeek:**
- API URL: `https://api.deepseek.com/v1/chat/completions`
- 模型名称: `deepseek-chat`
- API 格式: OpenAI 兼容格式

**通义千问:**
- API URL: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- 模型名称: `qwen-turbo`
- API 格式: OpenAI 兼容格式

---

## v1.2.0 - 2026-01-15

### 新增功能

#### 1. Groq AI 模型支持
- ✅ 添加了 Groq 超快推理引擎支持
- ✅ 支持 Llama 3.3 70B、Llama 3.1 系列、Mixtral 8x7B、Gemma 2 9B 等开源模型
- ✅ 提供业界领先的推理速度

#### 2. Google Gemini 模型支持
- ✅ 添加了 Google Gemini 系列模型支持
- ✅ 支持 Gemini 2.0 Flash、Gemini 1.5 Pro/Flash 等模型
- ✅ 提供高质量的翻译服务

### 使用说明

#### 配置 Groq
1. 访问 https://console.groq.com/keys 获取 API Key
2. 在插件设置中选择 "Groq"
3. 输入 API Key 并选择模型
4. 可选择填写自定义 API URL

#### 配置 Gemini
1. 访问 https://aistudio.google.com/app/apikey 获取 API Key
2. 在插件设置中选择 "Gemini (Google)"
3. 输入 API Key 并选择模型
4. 可选择填写自定义 API URL

---

## v1.1.0 - 2026-01-15

### 新增功能

#### 1. Grok AI 模型支持
- ✅ 添加了 xAI 公司的 Grok 系列模型支持
- ✅ 支持 Grok Beta、Grok 2 Latest、Grok 2 (1212)、Grok 2、Grok Vision Beta、Grok 1.5、Grok 1 等模型
- ✅ 可在设置页面选择 Grok 作为翻译提供商

#### 2. 自定义 API URL
- ✅ 所有 API 提供商（OpenAI、Claude、Grok）均支持自定义 API URL
- ✅ 支持使用代理服务器或第三方兼容接口
- ✅ 留空时使用官方默认地址：
  - OpenAI: `https://api.openai.com/v1/chat/completions`
  - Claude: `https://api.anthropic.com/v1/messages`
  - Grok: `https://api.x.ai/v1/chat/completions`

### 技术改进
- ✅ 扩展了 Chrome 插件的主机权限，支持任意 HTTPS/HTTP URL
- ✅ 优化了配置存储逻辑，添加了新的配置项
- ✅ 更新了翻译函数，支持动态 API URL 参数

### 使用说明

#### 配置自定义 API URL
1. 打开插件设置页面
2. 选择对应的 API 提供商（OpenAI/Claude/Grok）
3. 在"自定义 API URL"输入框中输入您的代理或第三方接口地址
4. 留空则使用官方默认地址
5. 保存设置

#### 使用 Grok AI
1. 访问 [xAI Console](https://console.x.ai/) 注册账号并获取 API Key
2. 打开插件设置，选择 "Grok (xAI)" 选项
3. 输入 API Key
4. 选择合适的 Grok 模型
5. （可选）配置自定义 API URL
6. 保存设置并开始使用

### 兼容性
- ✅ 完全兼容现有配置
- ✅ 旧用户无需重新配置
- ✅ 新增配置项为可选项

---

## v1.0.0 - 初始版本

### 基础功能
- ✅ 实时翻译 YouTube 视频字幕
- ✅ 支持 OpenAI GPT 系列模型
- ✅ 支持 Claude 系列模型
- ✅ 支持多语言翻译
- ✅ 优雅的翻译显示界面
