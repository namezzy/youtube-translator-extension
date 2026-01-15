#!/bin/bash
# 创建简单的 PNG 占位图标
for size in 16 48 128; do
  printf "P3\n$size $size\n255\n" > icon$size.ppm
  for ((i=0; i<$size*$size; i++)); do
    echo "26 115 232"
  done >> icon$size.ppm
  # 注意：这些是占位图标，建议使用设计工具创建更好的图标
done
echo "创建了占位图标文件"
