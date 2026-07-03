<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">设置</h1>
      <p class="page-desc">自定义你的音乐播放体验</p>
    </div>

    <div class="settings-sections">
      <!-- Appearance -->
      <section class="settings-group">
        <h2 class="group-label">外观</h2>
        <div class="settings-card">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">主题模式</span>
              <span class="setting-desc">切换深色与浅色主题</span>
            </div>
            <button class="theme-toggle" @click="themeStore.toggleTheme()">
              <div class="toggle-track" :class="{ active: themeStore.themeMode === 'light' }">
                <div class="toggle-thumb">
                  <Icon :icon="themeStore.themeMode === 'dark' ? 'carbon:moon' : 'carbon:sun'" width="14" height="14" />
                </div>
              </div>
              <span>{{ themeStore.themeMode === 'dark' ? '深色' : '浅色' }}</span>
            </button>
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">自定义背景</span>
              <span class="setting-desc">上传图片作为背景（JPG/PNG/WebP）</span>
            </div>
            <div class="bg-upload-area" @click="triggerUpload" @drop.prevent="handleDrop" @dragover.prevent>
              <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="handleFileSelect" />
              <Icon icon="carbon:image" width="18" height="18" />
              <span>选择图片</span>
            </div>
          </div>
          <template v-if="bgStore.hasBackground">
            <div class="setting-divider" />
            <div class="setting-row bg-preview-row">
              <div class="bg-preview" :style="{ backgroundImage: `url(${bgStore.bgImage})` }" />
              <button class="danger-btn" @click="handleClearBg">清除背景</button>
            </div>
            <div class="setting-divider" />
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">遮罩不透明度</span>
                <span class="setting-desc">{{ Math.round(bgStore.opacity * 100) }}%</span>
              </div>
              <div class="range-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  class="range-slider"
                  :value="Math.round(bgStore.opacity * 100)"
                  @input="onOpacityChange"
                />
              </div>
            </div>
            <div class="setting-divider" />
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">背景模糊</span>
                <span class="setting-desc">{{ bgStore.blur }}px</span>
              </div>
              <div class="range-control">
                <input
                  type="range"
                  min="0"
                  max="20"
                  class="range-slider"
                  :value="bgStore.blur"
                  @input="onBlurChange"
                />
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- Playback -->
      <section class="settings-group">
        <h2 class="group-label">播放</h2>
        <div class="settings-card">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">默认播放模式</span>
              <span class="setting-desc">歌曲播放的默认顺序</span>
            </div>
            <div class="select-wrapper">
              <select class="setting-select" :value="playerStore.playMode" @change="onPlayModeChange">
                <option value="sequential">顺序播放</option>
                <option value="random">随机播放</option>
                <option value="repeat-one">单曲循环</option>
              </select>
              <Icon icon="carbon:chevron-down" width="14" height="14" class="select-arrow" />
            </div>
          </div>
          <div class="setting-divider" />
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">默认音量</span>
              <span class="setting-desc">{{ Math.round(playerStore.volume * 100) }}%</span>
            </div>
            <div class="volume-control">
              <Icon :icon="volumeIcon" width="14" height="14" class="volume-icon" />
              <input
                type="range"
                min="0"
                max="100"
                class="range-slider"
                :value="Math.round(playerStore.volume * 100)"
                @input="onVolumeChange"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Storage -->
      <section class="settings-group">
        <h2 class="group-label">存储</h2>
        <div class="settings-card">
          <div class="setting-row">
            <div class="setting-info">
              <span class="setting-label">歌曲缓存</span>
              <span class="setting-desc">{{ songCount }} 首歌曲 · {{ totalSize }}</span>
            </div>
            <button class="danger-btn" :disabled="songCount === 0" @click="showClearConfirm = true">
              清空缓存
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Confirm Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
          <div class="modal">
            <div class="modal-icon">
              <Icon icon="carbon:warning" width="24" height="24" />
            </div>
            <h3 class="modal-title">确认清空缓存？</h3>
            <p class="modal-desc">将删除所有已上传的歌曲数据，此操作不可恢复。</p>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="showClearConfirm = false">取消</button>
              <button class="modal-btn confirm" @click="handleClearCache">确认清空</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'
import { useThemeStore } from '@/stores/theme'
import { useBackgroundStore } from '@/stores/background'
import { usePlayerStore } from '@/stores/player'
import { getSongCount, getTotalSize, clearAllSongs } from '@/db/songs'
import { formatFileSize } from '@/utils/format'
import type { PlayMode } from '@/types/music'

const themeStore = useThemeStore()
const bgStore = useBackgroundStore()
const playerStore = usePlayerStore()

const fileInput = ref<HTMLInputElement | null>(null)

const songCount = ref(0)
const totalSize = ref('0 B')
const showClearConfirm = ref(false)

const volumeIcon = computed(() => {
  const v = playerStore.volume
  if (v === 0) return 'carbon:volume-mute'
  if (v < 0.5) return 'carbon:volume-down'
  return 'carbon:volume-up'
})

onMounted(async () => {
  songCount.value = await getSongCount()
  const bytes = await getTotalSize()
  totalSize.value = formatFileSize(bytes)
})

function onPlayModeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as PlayMode
  while (playerStore.playMode !== value) {
    playerStore.togglePlayMode()
  }
}

function onVolumeChange(e: Event) {
  const value = parseInt((e.target as HTMLInputElement).value) / 100
  playerStore.setVolume(value)
}

function triggerUpload() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) handleBgFile(file)
  target.value = ''
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) handleBgFile(file)
}

function handleBgFile(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    ElMessage.warning('仅支持 JPG、PNG、WebP 格式')
    return
  }
  bgStore.uploadBackground(file)
  ElMessage.success('背景已应用')
}

function onOpacityChange(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value) / 100
  bgStore.opacity = v
}

function onBlurChange(e: Event) {
  bgStore.blur = parseInt((e.target as HTMLInputElement).value)
}

function handleClearBg() {
  bgStore.clearBackground()
  ElMessage.success('背景已清除')
}

async function handleClearCache() {
  try {
    await clearAllSongs()
    playerStore.clearPlaylist()
    songCount.value = 0
    totalSize.value = '0 B'
    showClearConfirm.value = false
    ElMessage.success('缓存已清空')
  } catch {
    ElMessage.error('清空失败')
  }
}
</script>

<style scoped lang="scss">
.settings-page {
  max-width: 560px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $text-muted;
  padding: 0 4px;
}

.settings-card {
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-lg;
  overflow: hidden;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 16px;

  @include mobile {
    padding: 14px 16px;
  }
}

.setting-divider {
  height: 1px;
  background: $bg-border;
  margin: 0 20px;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
}

.setting-desc {
  font-size: 12px;
  color: $text-muted;
}

// === Theme Toggle ===
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: $text-secondary;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  transition: color $transition-fast;

  &:hover {
    color: $text-primary;
  }
}

.toggle-track {
  width: 40px;
  height: 22px;
  border-radius: $radius-full;
  background: $bg-elevated;
  border: 1px solid $bg-border;
  position: relative;
  transition: all $transition-fast;

  &.active {
    background: $primary;
    border-color: $primary;

    .toggle-thumb {
      left: 18px;
    }
  }
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  @include flex-center;
  color: #1a1a1a;
  transition: left $transition-fast;
  box-shadow: $shadow-sm;
}

// === Select ===
.select-wrapper {
  position: relative;
}

.setting-select {
  padding: 7px 32px 7px 12px;
  border-radius: $radius-md;
  border: 1px solid $bg-border;
  background: $bg-elevated;
  color: $text-primary;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  appearance: none;
  min-width: 120px;

  &:focus {
    border-color: $primary;
  }
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: $text-muted;
  pointer-events: none;
}

// === Volume ===
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-icon {
  color: $text-muted;
}

.range-slider {
  width: 100px;
  height: 4px;
  appearance: none;
  background: $bg-elevated;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $primary;
    cursor: pointer;
    box-shadow: 0 2px 6px $primary-glow;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $primary;
    cursor: pointer;
    border: none;
  }
}

// === Background Upload ===
.bg-upload-area {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: $radius-md;
  border: 1px dashed $bg-border;
  background: $bg-elevated;
  color: $text-secondary;
  font-size: 12px;
  cursor: pointer;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    border-color: $primary;
    color: $primary-light;
    background: rgba(99, 102, 241, 0.04);
  }

  svg {
    flex-shrink: 0;
  }
}

.bg-preview-row {
  gap: 12px;
}

.bg-preview {
  width: 60px;
  height: 36px;
  border-radius: $radius-sm;
  background-size: cover;
  background-position: center;
  border: 1px solid $bg-border;
  flex-shrink: 0;
}

.range-control {
  display: flex;
  align-items: center;
}

// === Danger Button ===
.danger-btn {
  padding: 7px 16px;
  border-radius: $radius-full;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.06);
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

// === Modal ===
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-xl;
  padding: 28px;
  width: 360px;
  max-width: 90vw;
  text-align: center;
  box-shadow: $shadow-xl;
  animation: fade-in-scale 0.25s ease-out;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  @include flex-center;
  color: #ef4444;
  margin: 0 auto 16px;
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.modal-btn {
  padding: 8px 24px;
  border-radius: $radius-full;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;

  &.cancel {
    background: $glass-medium;
    color: $text-primary;

    &:hover {
      background: $glass-heavy;
    }
  }

  &.confirm {
    background: #ef4444;
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
