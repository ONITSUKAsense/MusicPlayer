<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-bg">
        <div class="bg-overlay" />
        <img :src="userStore.user?.avatar" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <h1 class="profile-nickname">{{ userStore.user?.nickname }}</h1>
        <p class="profile-username">@{{ userStore.user?.username }}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-value">{{ userStore.user?.followerCount }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userStore.user?.followingCount }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userStore.user?.level }}</span>
            <span class="stat-label">等级</span>
          </div>
        </div>
        <div v-if="userStore.user?.isVip" class="vip-badge">
          <Icon icon="carbon:crown" width="16" height="16" />
          VIP 会员
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <router-link to="/collection/likes" class="profile-card glass-card">
        <Icon icon="carbon:favorite" width="24" height="24" />
        <span>我喜欢</span>
      </router-link>
      <router-link to="/my/playlists" class="profile-card glass-card">
        <Icon icon="carbon:playlist" width="24" height="24" />
        <span>我的歌单</span>
      </router-link>
      <router-link to="/collection/history" class="profile-card glass-card">
        <Icon icon="carbon:time" width="24" height="24" />
        <span>最近播放</span>
      </router-link>
      <router-link to="/user/settings" class="profile-card glass-card">
        <Icon icon="carbon:settings" width="24" height="24" />
        <span>设置</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.profile-header { margin-bottom: 32px; }

.profile-bg {
  height: 180px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: $radius-xl;
  position: relative; overflow: hidden;
  .bg-overlay { position: absolute; inset: 0; background: linear-gradient(to top, $bg-dark, transparent); }
}

.profile-avatar {
  position: absolute; bottom: -50px; left: 32px;
  width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
  border: 4px solid $bg-dark; box-shadow: $shadow-lg;
}

.profile-info { padding: 70px 0 0; }
.profile-nickname { font-size: 24px; font-weight: 700; }
.profile-username { color: $text-secondary; font-size: 14px; margin-bottom: 12px; }

.profile-stats { display: flex; gap: 24px; margin-bottom: 12px; }
.stat-item { display: flex; flex-direction: column; }
.stat-value { font-size: 18px; font-weight: 600; }
.stat-label { font-size: 12px; color: $text-secondary; }

.vip-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: $radius-full;
  font-size: 12px; font-weight: 600; color: white;
}

.profile-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}

.profile-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 32px 20px; text-decoration: none; color: $text-primary;
  font-size: 14px; font-weight: 500; cursor: pointer; transition: all $transition-normal;
  &:hover { transform: translateY(-2px); }
}
</style>
