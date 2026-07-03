# Aurora 音乐播放器

一个基于 **Vue 3 + Electron + IndexedDB** 的本地 MP3 音乐播放器桌面应用。支持歌词同步显示、专辑封面管理、多种播放模式等特性。

## 功能特性

- **本地 MP3 播放** — 支持 MP3/WAV/FLAC/M4A 格式，上传后离线播放
- **LRC 歌词同步** — 解析 LRC 格式歌词文件，播放时高亮当前行并自动滚动
- **专辑封面管理** — 自动提取 MP3 文件内嵌封面图，支持封面显示
- **多种播放模式** — 顺序播放、随机播放、单曲循环
- **播放速度调节** — 0.5x ~ 2x 变速播放
- **深色/浅色主题** — 一键切换，支持自定义背景图片
- **桌面端快捷键** — `Space` 播放/暂停，`Ctrl+←/→` 切歌，`Ctrl+↑/↓` 调音量
- **Electron 桌面应用** — 可打包为 Windows 安装包

## 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3.5** (Composition API) | 前端 UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite 6** | 构建工具 |
| **Pinia** | 状态管理 |
| **Vue Router 4** | 路由管理 |
| **Electron 43** | 桌面容器 |
| **Element Plus** | UI 组件库 |
| **SCSS** | 样式预处理 |
| **IndexedDB** (idb-keyval) | 本地持久化存储 |
| **music-metadata** | MP3 元数据解析 |
| **Electron Builder** | 应用打包 |
| **Iconify** (Carbon) | 图标库 |

## 页面展示
<img width="1912" height="922" alt="image" src="https://github.com/user-attachments/assets/d94b63f2-fa2e-458a-960b-70a1b3a82302" />
<img width="1904" height="907" alt="image" src="https://github.com/user-attachments/assets/b38f0382-f084-4d57-9578-3bbc8322f3a9" />
<img width="1906" height="989" alt="image" src="https://github.com/user-attachments/assets/10cd936c-cabf-4c23-91a6-e9f5331602f4" />


## 架构设计

### 数据流

```
用户上传 MP3
    │
    ▼
processSong.ts ──► music-metadata 解析 (标题、艺术家、专辑、封面、时长)
    │
    ├── 音频数据 → Blob ──► IndexedDB (songs 表)
    ├── 封面图片 → Blob ──► URL.createObjectURL ──► 页面展示
    └── 元数据 → LocalSong 对象 ──► Pinia Player Store
                                          │
                                          ▼
                                  useAudioEngine.ts
                                          │
                                          ▼
                                    HTMLAudioElement
                                          │
                                    watch 响应式同步
                                          │
                                    Player Store 状态更新
```

### 存储方案

所有数据存储在浏览器/Electron 的 **IndexedDB** 中：

- **songs 表** — 存储歌曲完整数据（音频 Blob、封面 Blob、元数据）
- **settings 表** — 存储应用设置（自定义背景图片）

使用 `localStorage` 存储轻量级偏好（播放模式、音量、播放列表 ID 列表）。

### 核心模块

#### 1. 音频引擎 (`useAudioEngine.ts`)
- 使用原生 `HTMLAudioElement` 播放音频
- 通过 Vue `watch` 响应式监听 `PlayerStore` 状态变化
- 自动处理：切歌、播放/暂停、音量调节、进度跳转、变速播放
- 播放结束时自动下一首

#### 2. 播放状态管理 (`stores/player.ts`)
- Pinia Store，管理当前歌曲、播放列表、播放模式、音量等状态
- 播放模式：`sequential` / `random` / `repeat-one`
- 持久化：播放列表、音量、播放模式保存到 localStorage

#### 3. 歌曲处理 (`utils/processSong.ts`)
- 基于 `music-metadata` 库解析 MP3 文件元数据
- 提取 ID3 标签（标题、艺术家、专辑、内嵌封面）
- 将音频文件和封面转为 Blob 存储到 IndexedDB

#### 4. 歌词解析 (`utils/format.ts` - `parseLyric`)
- 解析标准 LRC 格式 `[mm:ss.xx]歌词内容`
- 按时间排序生成有序歌词数组
- 组件根据当前播放时间实时计算高亮行

#### 5. 背景管理 (`stores/background.ts`)
- 支持用户上传自定义背景图片
- 图片存为 Blob 到 IndexedDB
- 动态调整遮罩不透明度和模糊程度
- 背景激活时自动降低 UI 元素透明度

### 路由设计

```
/          首页（音乐库 + 当前播放）
/upload    上传音乐页（拖拽/点击上传）
/settings  设置页（主题、背景、播放、存储管理）
/about     关于页（技术栈、功能列表）
```

### 桌面端集成

`electron/main.cjs` 配置了：
- 窗口大小 1280×800，最小 900×600
- contextIsolation 安全隔离
- 键盘快捷键映射（通过 IPC 通信）
- 开发模式自动加载 `localhost:5173`

### 样式体系

基于 SCSS 变量 + CSS 自定义属性：
- `variables.scss` — 颜色、间距、圆角、阴影等设计令牌
- `mixins.scss` — 响应式断点、flex 居中、渐变文字、自定义滚动条
- 深色/浅色主题通过 `[data-theme]` 属性切换
- 自定义背景通过 `.has-custom-bg` 类调整半透明层级

## 项目结构

```
├── electron/
│   ├── main.cjs          # Electron 主进程
│   └── preload.cjs       # 预加载脚本（IPC 桥接）
├── public/               # 静态资源
├── src/
│   ├── components/
│   │   ├── common/       # 通用组件 (Empty, Skeleton, Loading)
│   │   ├── layout/       # 布局组件 (Navbar, Sidebar)
│   │   └── player/       # 播放器组件 (PlayerBar, LyricDisplay)
│   ├── composables/      # 组合式函数 (useAudioEngine, usePlayer)
│   ├── db/               # IndexedDB 操作 (songs.ts)
│   ├── layouts/          # 页面布局 (DefaultLayout)
│   ├── pages/            # 页面组件 (home, upload, settings, about)
│   ├── router/           # 路由配置与守卫
│   ├── stores/           # Pinia 状态管理 (player, theme, ui, user, background)
│   ├── styles/           # 全局样式 (variables, mixins, global, glass, animations)
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数 (format, processSong, audio, storage)
├── index.html
├── vite.config.ts
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动 Web 开发服务器
npm run dev

# 启动 Electron 开发模式
npm run dev:electron

# 构建生产版本
npm run build

# 构建 Electron 桌面安装包
npm run build:electron
```

## 打包发布

执行以下命令会在 `release/` 目录生成 Windows 安装程序（.exe）：

```bash
npm run build:electron
```

支持的打包格式（在 `package.json` 中配置）：
- **Windows** — NSIS 安装包（支持自定义安装目录、桌面快捷方式）

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 播放/暂停 |
| `Ctrl + →` | 下一首 |
| `Ctrl + ←` | 上一首 |
| `Ctrl + ↑` | 音量增加 |
| `Ctrl + ↓` | 音量减小 |
| `Esc` | 关闭弹窗/侧边栏 |

## License

MIT
