# 推送到 GitHub 指南

## 当前状态
- ✅ Git 仓库已初始化
- ✅ 所有文件已提交
- ✅ 远程仓库已配置：https://github.com/namezzy/youtube-translator-extension
- ❌ 需要身份验证

## 方式 1：使用 Personal Access Token（推荐）

### 步骤 1：生成 Token
1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   - Note: `youtube-translator-extension`
   - Expiration: 选择有效期（建议 90 天或更长）
   - 勾选权限：**✅ repo** （完整的仓库访问权限）
4. 点击 **"Generate token"**
5. **立即复制** token（格式：ghp_xxxxxxxxxxxxx）

 **重要**：Token 只显示一次，请妥善保存！

### 步骤 2：推送到 GitHub

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"
```bash
cd /root/youtube-translator-extension
git push -u origin main
```

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"
- **Username**: `namezzy`
- **Password**: `粘贴你的 Personal Access Token`

### 步骤 3：验证推送

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"https://github.com/namezzy/youtube-translator-extension


---

## 方式 2：使用 SSH Key（更安全）

### 步骤 1：生成 SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

cd /root/p_website && git commit "Change layout margins to adaptive instead of fixed  -m

### 步骤 2：查看并复制公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed  `ssh-ed25519` 开头）

### 步骤 3：添加到 GitHub

1. 访问：https://github.com/settings/keys
2. 点击 **"New SSH key"**
3. 填写：
   - Title: `youtube-translator-server`
   - Key: 粘贴刚才复制的公钥
4. 点击 **"Add SSH key"**

### 步骤 4：更改远程 URL 并推送

```bash
cd /root/youtube-translator-extension
git remote set-url origin git@github.com:namezzy/youtube-translator-extension.git
git push -u origin main
```

---

## 后续推送

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"

```bash
cd /root/youtube-translator-extension
git add .
git commit -m "你的提交信息"
git push
```

---

## 常见问题

### Q: Token 认证失败？
A: 确保：
- Token 有 `repo` 权限
- Token 未过期
- 密码处粘贴的是 token 而不是 GitHub 密码

### Q: SSH 连接失败？
cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"
```bash
ssh -T git@github.com
```

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"`Hi namezzy! You've successfully authenticated...`

### Q: 如何保存 Token 避免每次输入？
A: 使用 Git 凭证管理：
```bash
git config --global credential.helper store
```

cd /root/p_website && git commit -m "Change layout margins to adaptive instead of fixed pixels"

---

**选择一种方式完成推送后，你的项目就会在 GitHub 上公开/私有可见！** 🎉
