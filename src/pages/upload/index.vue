<template>
  <div class="upload-page">
    <div class="page-header">
      <h1 class="page-title">上传音乐</h1>
      <p class="page-desc">支持 MP3 格式，可搭配 LRC 歌词和封面图片</p>
    </div>

    <!-- Upload Zone -->
    <div
      class="upload-zone"
      :class="{ 'is-dragover': isDragover, uploading: isUploading }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragover = true"
      @dragenter.prevent="isDragover = true"
      @dragleave.prevent="isDragover = false"
    >
      <div class="upload-zone-content">
        <div class="upload-icon-wrapper">
          <div class="upload-icon-bg" />
          <div class="upload-icon">
            <Icon v-if="!isUploading" icon="carbon:cloud-upload" width="36" height="36" />
            <div v-else class="uploading-spinner" />
          </div>
        </div>
        <p class="upload-text">{{ isUploading ? '正在处理...' : '拖拽 MP3 文件到此处' }}</p>
        <p class="upload-hint">或点击下方按钮选择文件</p>
        <input
          ref="fileInput"
          type="file"
          accept=".mp3,.wav,.flac,.m4a,audio/mpeg,audio/wav,audio/flac,audio/mp4,audio/x-m4a"
          multiple
          class="file-input"
          @change="handleFileSelect"
        />
        <button class="select-btn" :disabled="isUploading" @click="fileInput?.click()">
          <Icon icon="carbon:folder" width="16" height="16" />
          {{ isUploading ? '处理中...' : '选择文件' }}
        </button>
      </div>
    </div>

    <!-- Upload Queue -->
    <div v-if="uploadQueue.length > 0" class="upload-queue">
      <div class="queue-header">
        <h2 class="queue-title">上传队列</h2>
        <span class="queue-count">{{ doneCount }}/{{ uploadQueue.length }}</span>
      </div>

      <TransitionGroup name="queue-item" tag="div" class="queue-list">
        <div v-for="(item, idx) in uploadQueue" :key="idx" class="queue-item" :class="item.status">
          <div class="queue-item-cover">
            <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.name" />
            <Icon v-else icon="carbon:music" width="18" height="18" />
          </div>
          <div class="queue-item-info">
            <span class="queue-item-name truncate-1">{{ item.displayName || item.name }}</span>
            <span class="queue-item-size">{{ formatFileSize(item.size) }}</span>
          </div>
          <div class="queue-item-status">
            <template v-if="item.status === 'processing'">
              <div class="status-spinner" />
              <span>处理中</span>
            </template>
            <template v-else-if="item.status === 'done'">
              <Icon icon="carbon:checkmark" width="14" height="14" class="done-icon" />
              <span>完成</span>
            </template>
            <template v-else-if="item.status === 'error'">
              <Icon icon="carbon:error" width="14" height="14" class="error-icon" />
              <span>{{ item.errorMsg }}</span>
            </template>
            <template v-else>
              <span class="pending-dot" />
              <span>等待中</span>
            </template>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'
import { formatFileSize } from '@/utils/format'
import { processMp3File } from '@/utils/processSong'
import { saveSong } from '@/db/songs'
import { usePlayerStore } from '@/stores/player'

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/x-m4a', 'audio/wave', 'audio/x-wav']
const ACCEPTED_EXTS = ['.mp3', '.wav', '.flac', '.m4a']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

const playerStore = usePlayerStore()
const fileInput = ref<HTMLInputElement>()
const isDragover = ref(false)
const isUploading = ref(false)

interface QueueItem {
  name: string
  size: number
  displayName?: string
  coverUrl?: string
  status: 'pending' | 'processing' | 'done' | 'error'
  errorMsg?: string
}

const uploadQueue = ref<QueueItem[]>([])
const doneCount = computed(() => uploadQueue.value.filter((i) => i.status === 'done').length)

function isAudioFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ACCEPTED_EXTS.includes(ext)
}

async function handleDrop(e: DragEvent) {
  isDragover.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  await processFiles(files)
}

async function handleFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  await processFiles(files)
  if (fileInput.value) fileInput.value.value = ''
}

async function processFiles(files: File[]) {
  const audioFiles = files.filter(isAudioFile)

  // Check for unsupported formats
  const unsupported = files.filter((f) => !isAudioFile(f))
  if (unsupported.length > 0) {
    ElMessage.warning(`不支持的文件格式：${unsupported.map((f) => f.name).join('、')}`)
  }

  if (audioFiles.length === 0) {
    return
  }

  // Check file sizes
  const oversized = audioFiles.filter((f) => f.size > MAX_FILE_SIZE)
  if (oversized.length > 0) {
    ElMessage.warning(`文件超过 100MB 限制：${oversized.map((f) => f.name).join('、')}`)
    return
  }

  isUploading.value = true
  let successCount = 0

  for (const file of audioFiles) {
    const item: QueueItem = {
      name: file.name,
      size: file.size,
      status: 'processing',
    }
    uploadQueue.value.push(item)

    try {
      const { song } = await processMp3File(file)
      await saveSong(song)
      item.status = 'done'
      item.displayName = song.title
      item.coverUrl = song.coverUrl || undefined

      // Auto-add to playlist
      playerStore.addToPlaylist(song)
      successCount++
    } catch (err) {
      item.status = 'error'
      item.errorMsg = err instanceof Error ? err.message : '处理失败'
      console.error('Process error:', err)
    }
  }

  isUploading.value = false

  if (successCount > 0) {
    ElMessage.success(`成功上传 ${successCount} 首歌曲`)
  } else {
    ElMessage.error('所有文件上传失败，请检查文件是否损坏')
  }
}
</script>

<style scoped lang="scss">
.upload-page {
  max-width: 640px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}

// === Upload Zone ===
.upload-zone {
  background: $bg-card;
  border: 1.5px dashed $bg-border;
  border-radius: $radius-xl;
  padding: 48px 20px;
  text-align: center;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    background: $gradient-subtle;
  }

  &.is-dragover {
    border-color: $primary;
    background: rgba(99, 102, 241, 0.06);
    transform: scale(1.01);
  }

  &.uploading {
    cursor: default;
  }
}

.upload-zone-content {
  position: relative;
  z-index: 1;
}

.upload-icon-wrapper {
  position: relative;
  display: inline-flex;
  margin-bottom: 16px;
}

.upload-icon-bg {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, $primary-glow, transparent);
}

.upload-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $glass-medium;
  @include flex-center;
  color: $primary-light;
  position: relative;
  z-index: 1;
}

.uploading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(99, 102, 241, 0.15);
  border-top-color: $primary-light;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.upload-hint {
  font-size: 13px;
  color: $text-muted;
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.select-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: $radius-full;
  border: none;
  background: $gradient-primary;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;
  box-shadow: 0 4px 15px $primary-glow;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 25px $primary-glow;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// === Queue ===
.upload-queue {
  margin-top: 28px;
}

.queue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.queue-title {
  font-size: 15px;
  font-weight: 600;
}

.queue-count {
  font-size: 12px;
  color: $text-muted;
  font-feature-settings: 'tnum';
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: $bg-card;
  border: 1px solid $bg-border;
  border-radius: $radius-md;
  transition: all $transition-normal;

  &.done {
    border-color: rgba(34, 197, 94, 0.15);
    background: rgba(34, 197, 94, 0.03);
  }

  &.error {
    border-color: rgba(239, 68, 68, 0.15);
    background: rgba(239, 68, 68, 0.03);
  }
}

.queue-item-cover {
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  overflow: hidden;
  flex-shrink: 0;
  background: $bg-elevated;
  @include flex-center;
  color: $text-muted;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.queue-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.queue-item-name {
  font-size: 13px;
  font-weight: 500;
}

.queue-item-size {
  font-size: 11px;
  color: $text-muted;
}

.queue-item-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: $text-secondary;

  .done-icon { color: #22c55e; }
  .error-icon { color: #ef4444; }
}

.status-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: $primary-light;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.pending-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $text-muted;
}

// === Queue Item Transitions ===
.queue-item-enter-active,
.queue-item-leave-active {
  transition: all 0.3s ease;
}

.queue-item-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.queue-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.queue-item-move {
  transition: transform 0.3s ease;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
