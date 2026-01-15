#!/usr/bin/env python3
from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    white = (255, 255, 255)
    blue = (41, 128, 185)
    purple = (142, 68, 173)
    
    padding = int(size * 0.1)
    circle_size = size - padding * 2
    
    # YouTube红色渐变背景
    gradient_colors = [(220, 20, 60), (255, 69, 0)]
    for i in range(circle_size):
        ratio = i / circle_size
        r = int(gradient_colors[0][0] * (1 - ratio) + gradient_colors[1][0] * ratio)
        g = int(gradient_colors[0][1] * (1 - ratio) + gradient_colors[1][1] * ratio)
        b = int(gradient_colors[0][2] * (1 - ratio) + gradient_colors[1][2] * ratio)
        
        offset = i // 2
        draw.ellipse(
            [padding + offset, padding + offset, 
             size - padding - offset, size - padding - offset],
            fill=(r, g, b, 255)
        )
    
    # 播放按钮
    center_x = size // 2
    center_y = size // 2
    triangle_size = int(size * 0.25)
    
    triangle_points = [
        (center_x - triangle_size // 3, center_y - triangle_size // 2),
        (center_x - triangle_size // 3, center_y + triangle_size // 2),
        (center_x + triangle_size // 2, center_y)
    ]
    draw.polygon(triangle_points, fill=white)
    
    # 翻译标记
    if size >= 48:
        badge_size = int(size * 0.35)
        badge_x = size - padding - badge_size + 5
        badge_y = size - padding - badge_size + 5
        
        for i in range(badge_size):
            ratio = i / badge_size
            r = int(blue[0] * (1 - ratio) + purple[0] * ratio)
            g = int(blue[1] * (1 - ratio) + purple[1] * ratio)
            b = int(blue[2] * (1 - ratio) + purple[2] * ratio)
            
            offset = i // 2
            draw.ellipse(
                [badge_x + offset, badge_y + offset,
                 badge_x + badge_size - offset, badge_y + badge_size - offset],
                fill=(r, g, b, 255)
            )
        
        arrow_size = int(badge_size * 0.6)
        arrow_x = badge_x + badge_size // 2
        arrow_y = badge_y + badge_size // 2
        arrow_offset = int(arrow_size * 0.3)
        
        draw.polygon([
            (arrow_x - arrow_offset, arrow_y - 2),
            (arrow_x - arrow_offset - 4, arrow_y - 2),
            (arrow_x - arrow_offset - 2, arrow_y - 4),
        ], fill=white)
        
        draw.polygon([
            (arrow_x + arrow_offset, arrow_y + 2),
            (arrow_x + arrow_offset + 4, arrow_y + 2),
            (arrow_x + arrow_offset + 2, arrow_y + 4),
        ], fill=white)
        
        draw.line([
            (arrow_x - arrow_offset, arrow_y - 2),
            (arrow_x + arrow_offset, arrow_y + 2)
        ], fill=white, width=2)
    
    border_width = max(1, size // 32)
    draw.ellipse(
        [padding, padding, size - padding, size - padding],
        outline=(255, 255, 255, 180),
        width=border_width
    )
    
    img.save(filename, 'PNG')
    print(f"✓ {filename} ({size}x{size})")

print("🎨 生成 YouTube Translator 图标...\n")

sizes = [(16, 'icon16.png'), (48, 'icon48.png'), (128, 'icon128.png')]
for size, filename in sizes:
    create_icon(size, filename)

print("\n✅ 完成！\n")
print("设计说明：")
print("  • YouTube红色渐变背景")
print("  • 白色播放按钮")
print("  • 蓝紫渐变翻译徽章")
