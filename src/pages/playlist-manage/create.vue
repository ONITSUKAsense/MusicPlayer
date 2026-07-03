<template>
  <div class="create-playlist">
    <h1 class="page-title">创建歌单</h1>
    <div class="form-card glass-card">
      <el-form :model="form" label-position="top">
        <el-form-item label="歌单名称">
          <el-input v-model="form.name" placeholder="输入歌单名称" size="large" class="form-input" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="描述你的歌单..."
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tags" placeholder="用逗号分隔，如：流行, 经典" size="large" class="form-input" />
        </el-form-item>
        <div class="form-actions">
          <el-button @click="router.back()">取消</el-button>
          <el-button type="primary" @click="handleCreate" class="submit-btn">创建歌单</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({ name: '', description: '', tags: '' })

function handleCreate() {
  if (!form.name.trim()) {
    ElMessage.warning('请输入歌单名称')
    return
  }
  ElMessage.success('歌单创建成功')
  router.push('/my/playlists')
}
</script>

<style scoped lang="scss">
.page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
.form-card { max-width: 600px; padding: 32px; }
.form-input :deep(.el-input__wrapper),
.form-input :deep(.el-textarea__inner) {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); box-shadow: none;
  color: $text-primary;
}
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.submit-btn { background: $primary; border: none; }
</style>
