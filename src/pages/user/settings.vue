<template>
  <div class="settings-page">
    <h1 class="page-title">{{ t('settings.title') }}</h1>

    <div class="settings-section">
      <h2 class="section-title">{{ t('settings.appearance') }}</h2>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.theme') }}</span>
          <span class="setting-desc">{{ t('settings.dark') }}/{{ t('settings.light') }}</span>
        </div>
        <el-switch
          :model-value="themeStore.themeMode === 'dark'"
          @change="themeStore.toggleTheme()"
          :active-text="t('settings.dark')"
          :inactive-text="t('settings.light')"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.language') }}</span>
          <span class="setting-desc">简体中文 / English</span>
        </div>
        <el-select
          :model-value="themeStore.language"
          @change="themeStore.setLanguage"
          class="setting-select"
        >
          <el-option value="zh-CN" label="简体中文" />
          <el-option value="en-US" label="English" />
        </el-select>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">{{ t('settings.playSettings') }}</h2>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.backgroundPlay') }}</span>
          <span class="setting-desc">切换到后台时继续播放</span>
        </div>
        <el-switch :model-value="true" />
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">{{ t('settings.notifications') }}</h2>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.pushNotifications') }}</span>
          <span class="setting-desc">{{ t('settings.receiveRecommendations') }}</span>
        </div>
        <el-switch :model-value="false" />
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">{{ t('settings.cache') }}</h2>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">{{ t('settings.cacheSize') }}</span>
          <span class="setting-desc">当前缓存: {{ cacheSize }}</span>
        </div>
        <el-button size="small" @click="clearCache">{{ t('settings.clearCache') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const themeStore = useThemeStore()
const cacheSize = ref('12.5 MB')

function clearCache() {
  cacheSize.value = '0 KB'
  ElMessage.success(t('settings.cacheCleared'))
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 32px; }

.settings-section {
  margin-bottom: 32px; padding: 24px; border-radius: $radius-lg;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 14px; font-weight: 600; color: $primary-light;
  margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;
}

.setting-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0;
  &:not(:last-child) { border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
}

.setting-info { display: flex; flex-direction: column; gap: 2px; }
.setting-label { font-size: 14px; font-weight: 500; }
.setting-desc { font-size: 12px; color: $text-secondary; }
.setting-select { width: 140px; }
</style>
