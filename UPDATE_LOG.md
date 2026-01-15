# 更新日志

## v1.1.0 - 2026-01-15

### 新增功能

#### 1. Grok AI 模型支持
- ✅ 添加了 xAI 公司的 Grok 系列模型支持
- ✅ 支持 Grok Beta、Grok 2 Latest、Grok 2 (1212) 等模型
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
