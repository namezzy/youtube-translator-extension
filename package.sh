#!/bin/bash
# 打包 Chrome 扩展

echo "📦 正在打包 YouTube Translator 扩展..."

# 创建临时目录
TEMP_DIR="youtube-translator-temp"
ZIP_NAME="youtube-translator-extension.zip"

# 清理旧文件
rm -rf $TEMP_DIR $ZIP_NAME

# 复制文件
mkdir -p $TEMP_DIR
cp -r youtube-translator-extension/* $TEMP_DIR/

# 删除不需要的文件
rm -f $TEMP_DIR/package.sh
rm -f $TEMP_DIR/create_icons.sh
rm -f $TEMP_DIR/icons/generate_icons.py
rm -f $TEMP_DIR/PROJECT.md

# 创建 ZIP 包
cd $TEMP_DIR
zip -r ../$ZIP_NAME * -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# 清理
rm -rf $TEMP_DIR

echo "✅ 打包完成！文件：$ZIP_NAME"
echo ""
echo "📋 下一步："
echo "1. 解压 $ZIP_NAME"
echo "2. 在 Chrome 中打开 chrome://extensions/"
echo "3. 启用开发者模式"
echo "4. 点击'加载已解压的扩展程序'"
echo "5. 选择解压后的文件夹"
echo ""
echo "或者直接使用当前文件夹进行开发测试！"
