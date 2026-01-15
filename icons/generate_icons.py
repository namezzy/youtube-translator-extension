from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # 创建图标
    img = Image.new('RGB', (size, size), color='#1a73e8')
    draw = ImageDraw.Draw(img)
    
    # 绘制翻译图标 (简化的文档+箭头)
    margin = size // 6
    
    # 左侧文档
    draw.rectangle([margin, margin, size//2-5, size-margin], fill='white')
    
    # 箭头
    arrow_y = size // 2
    arrow_start = size//2
    arrow_end = size//2 + 15
    draw.polygon([
        (arrow_start, arrow_y-5),
        (arrow_end, arrow_y),
        (arrow_start, arrow_y+5)
    ], fill='white')
    
    # 右侧文档
    draw.rectangle([size//2+20, margin, size-margin, size-margin], fill='white')
    
    # 保存
    img.save(f'icon{size}.png')
    print(f'Created icon{size}.png')

.bash_history .bashrc .cache .config .copilot .gitconfig .lesshst .npm .nvm .profile .selected_editor .ssh .viminfo .vscode-server .wakatime .wakatime.cfg .wget-hsts API-Gateway Corporate_Website Go_Code IM-System Process-tracking Short-URL findAction go go_basic golang-IM-System nohup.out p_website usercenter youtube-translator-extension 
for size in [16, 48, 128]:
    create_icon(size)
