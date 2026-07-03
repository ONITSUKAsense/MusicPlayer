<template>
  <div class="not-found">
    <div class="bg-glow">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
    </div>
    <div class="content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/home" class="back-btn">
        <Icon icon="carbon:home" width="18" height="18" />
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped lang="scss">
.not-found {
  width: 100%; height: 80vh; @include flex-center; flex-direction: column;
  position: relative; overflow: hidden;
}
.bg-glow { position: absolute; inset: 0; }
.gradient-orb {
  position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3;
  &.orb-1 { width: 300px; height: 300px; background: #6366f1; top: 10%; left: 20%; }
  &.orb-2 { width: 250px; height: 250px; background: #8b5cf6; bottom: 20%; right: 20%; }
}
.content { text-align: center; z-index: 1; }
.error-code { font-size: 120px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; margin-bottom: 16px; }
.error-title { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
.error-desc { color: $text-secondary; margin-bottom: 32px; }
.back-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px;
  background: $primary; color: white; border-radius: $radius-full; text-decoration: none;
  font-size: 14px; font-weight: 500; transition: all $transition-fast;
  &:hover { opacity: 0.9; transform: translateY(-2px); }
}
</style>
