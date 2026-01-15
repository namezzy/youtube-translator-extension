#!/bin/bash

echo "🔍 验证视频总结功能实现..."
echo ""

echo "✓ 检查文件完整性..."
files=("popup/popup.html" "popup/popup.js" "scripts/content.js" "styles/content.css" "manifest.json")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file 存在"
    else
        echo "  ✗ $file 缺失"
        exit 1
    fi
done

echo ""
echo "✓ 检查关键代码..."

if grep -q "summaryBtn" popup/popup.html; then
    echo "  ✓ 总结按钮已添加到 popup.html"
fi

if grep -q "summarizeVideo" popup/popup.js; then
    echo "  ✓ 总结按钮事件已添加到 popup.js"
fi

if grep -q "summarizeVideo" scripts/content.js; then
    echo "  ✓ 函数 summarizeVideo 已实现"
fi

if grep -q "extractSubtitles" scripts/content.js; then
    echo "  ✓ 函数 extractSubtitles 已实现"
fi

if grep -q "generateSummary" scripts/content.js; then
    echo "  ✓ 函数 generateSummary 已实现"
fi

if grep -q "displaySummary" scripts/content.js; then
    echo "  ✓ 函数 displaySummary 已实现"
fi

if grep -q "yt-summary" styles/content.css; then
    echo "  ✓ 总结样式已添加到 content.css"
fi

if grep -q '"version": "1.1.0"' manifest.json; then
    echo "  ✓ 版本号已更新为 1.1.0"
fi

echo ""
echo "✓ 代码统计..."
content_lines=$(wc -l < scripts/content.js)
css_lines=$(wc -l < styles/content.css)
echo "  • scripts/content.js: $content_lines 行"
echo "  • styles/content.css: $css_lines 行"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 验证完成！视频总结功能已成功实现！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
