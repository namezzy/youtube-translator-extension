#!/bin/bash
# 验证扩展文件完整性

echo "🔍 验证 YouTube Translator 扩展文件..."
echo ""

ERRORS=0

# 检查必需文件
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
  else
    echo "❌ 缺失: $1"
    ERRORS=$((ERRORS + 1))
  fi
}

# 核心文件
check_file "manifest.json"
check_file "README.md"

# 弹出窗口
check_file "popup/popup.html"
check_file "popup/popup.js"

# 设置页面
check_file "options/options.html"
check_file "options/options.js"

# 脚本
check_file "scripts/content.js"
check_file "scripts/background.js"

# 样式
check_file "styles/content.css"

# 图标
check_file "icons/icon16.png"
check_file "icons/icon48.png"
check_file "icons/icon128.png"

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "🎉 所有文件验证通过！扩展可以使用了！"
  echo ""
  echo "📖 快速开始："
  "   1. 查看 QUICKSTART.md 了解使 echo"
  echo "   2. 查看 README.md 了解详细信息"
  echo "   3. 在 Chrome 中加载扩展开始使用"
else
  echo "⚠️  发现 $ERRORS 个问题，请修复后再使用"
fi
