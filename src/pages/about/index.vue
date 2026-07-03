<template>
  <div class="about-page">
    <!-- Hero -->
    <div class="about-hero">
      <div class="about-hero-bg" aria-hidden="true" />
      <div class="about-icon-wrapper">
        <div class="about-icon-ring" />
        <div class="about-icon">
          <Icon icon="carbon:music" width="32" height="32" />
        </div>
      </div>
      <h1 class="app-name">Aurora</h1>
      <p class="app-version">v1.0.0</p>
      <p class="app-desc">本地 MP3 音乐播放器，支持歌词显示与封面管理</p>
    </div>

    <!-- Content -->
    <div class="about-body">
      <!-- Tech Stack -->
      <section class="about-section">
        <h2 class="section-label">技术栈</h2>
        <div class="tech-grid">
          <div v-for="tech in techStack" :key="tech.name" class="tech-card">
            <div class="tech-left">
              <div class="tech-dot" :style="{ background: tech.color }" />
              <span class="tech-name">{{ tech.name }}</span>
            </div>
            <span class="tech-version">{{ tech.version }}</span>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="about-section">
        <h2 class="section-label">功能特性</h2>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature" class="feature-item">
            <div class="feature-check">
              <Icon icon="carbon:checkmark" width="12" height="12" />
            </div>
            <span>{{ feature }}</span>
          </div>
        </div>
      </section>

      <!-- Open Source -->
      <section class="about-section">
        <h2 class="section-label">开源</h2>
        <div class="opensource-card">
          <Icon icon="carbon:logo-github" width="20" height="20" />
          <div class="opensource-info">
            <p>本项目基于 MIT 协议开源</p>
            <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="about-link">
              查看源代码
              <Icon icon="carbon:launch" width="12" height="12" />
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const repoUrl = 'https://github.com/ONITSUKAsense/MusicPlayer'

const techStack = [
  { name: 'Vue 3.5', version: '3.5', color: '#4FC08D' },
  { name: 'TypeScript', version: '5.x', color: '#3178C6' },
  { name: 'Vite', version: '6.x', color: '#FFC018' },
  { name: 'Pinia', version: '2.x', color: '#FFD859' },
  { name: 'Vue Router', version: '4.x', color: '#4FC08D' },
  { name: 'Electron', version: '43.x', color: '#9FEAF9' },
  { name: 'Element Plus', version: '2.x', color: '#409EFF' },
  { name: 'SCSS', version: '2.x', color: '#CD6799' },
  { name: 'idb-keyval', version: '6.x', color: '#6366f1' },
  { name: 'GSAP', version: '3.x', color: '#88CE02' },
  { name: 'Iconify', version: '5.x', color: '#1769AA' },
]

const features = [
  '本地 MP3 文件上传与播放',
  'LRC 歌词解析与同步显示',
  '专辑封面图片管理',
  '多种播放模式（顺序、随机、单曲循环）',
  '播放速度调节（0.5x ~ 2x）',
  '深色/浅色主题切换',
  'IndexedDB 本地持久化存储',
  'Electron 桌面应用打包',
  '响应式设计，多端适配',
  '键盘快捷键支持',
]
</script>

<style scoped lang="scss">
.about-page {
  max-width: 640px;
  margin: 0 auto;
}

// === Hero ===
.about-hero {
  text-align: center;
  padding: 48px 20px 40px;
  position: relative;
  overflow: hidden;
}

.about-hero-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
  pointer-events: none;
}

.about-icon-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 20px;
}

.about-icon-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid rgba(99, 102, 241, 0.12);
  animation: float 5s ease-in-out infinite;
}

.about-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: $gradient-primary;
  @include flex-center;
  color: white;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 30px $primary-glow;
}

.app-name {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.app-version {
  font-size: 13px;
  color: $text-muted;
  margin-bottom: 12px;
  font-feature-settings: 'tnum';
}

.app-desc {
  font-size: 14px;
  color: $text-secondary;
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.6;
}

// === Body Sections ===
.about-body {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $text-muted;
  padding: 0 4px;
}

// === Tech Stack ===
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tech-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    background: $bg-elevated;
  }
}

.tech-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.tech-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tech-name {
  font-size: 13px;
  font-weight: 500;
}

.tech-version {
  font-size: 11px;
  color: $text-muted;
  font-feature-settings: 'tnum';
}

// === Features ===
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 6px;

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-md;
  font-size: 13px;
  transition: all $transition-fast;
}

.feature-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  @include flex-center;
  color: #22c55e;
  flex-shrink: 0;
}

// === Open Source ===
.opensource-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-lg;

  svg {
    color: $text-secondary;
    flex-shrink: 0;
  }
}

.opensource-info {
  flex: 1;
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.6;

  p {
    margin-bottom: 2px;
  }
}

.about-link {
  color: $primary-light;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>
