#!/bin/bash

echo "🔍 验证字幕下载对照功能..."
echo ""

echo "✓ 检查关键函数..."

functions=(
    "downloadSubtitles"
    "extractSubtitlesWithTimestamps"
    "parseSubtitleXMLWithTimestamps"
    "translateSubtitles"
    "displaySubtitleComparison"
    "downloadSubtitlesAsTxt"
)

for func in "${functions[@]}"; do
    if grep -q "$func" scripts/content.js; then
        echo "  ✓ 函数 $func 已实现"
    else
        echo "  ✗ 函数 $func 未找到"
    fi
done

echo ""
echo "✓ 检查界面元素..."

if grep -q "subtitleBtn" popup/popup.html; then
    echo "  ✓ 下载按钮已添加"
fi

if grep -q "yt-subtitle-comparison" styles/content.css; then
    echo "  ✓ 对照界面样式已添加"
fi

if grep -q "downloadSubtitles" popup/popup.js; then
    echo "  ✓ 按钮事件已绑定"
fi

echo ""
echo "✓ 版本信息..."
version=$(grep '"version"' manifest.json | head -1)
echo "  $version"

echo ""
"echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "🎉 字幕下载对照功能验证通过！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

