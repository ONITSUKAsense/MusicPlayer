<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
    </div>

    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">
          <Icon icon="carbon:locked" width="28" height="28" />
        </div>
        <h1>忘记密码</h1>
        <p>输入邮箱，我们将发送重置链接</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" class="auth-form">
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱地址"
            :prefix-icon="Message"
            size="large"
            class="auth-input"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="auth-btn"
          :loading="loading"
          @click="handleReset"
        >
          {{ loading ? '发送中...' : '发送重置链接' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        想起密码了?
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const loading = ref(false)

const form = reactive({ email: '' })
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确邮箱', trigger: 'blur' },
  ],
}

async function handleReset() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    await new Promise((r) => setTimeout(r, 1000))
    ElMessage.success('重置链接已发送，请检查邮箱')
    loading.value = false
  })
}
</script>

<style scoped lang="scss">
.auth-page {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: $bg-dark; position: relative; overflow: hidden;
}
.auth-bg { position: absolute; inset: 0; }
.gradient-orb {
  position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3;
  &.orb-1 { width: 500px; height: 500px; background: #6366f1; top: -100px; right: -100px; animation: float 8s ease-in-out infinite; }
  &.orb-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -100px; left: -100px; animation: float 6s ease-in-out infinite reverse; }
}
.auth-card {
  width: 420px; padding: 40px; border-radius: $radius-xl; position: relative; z-index: 1;
  animation: slideUp 0.5s ease-out;
  background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06);
}
.auth-header { text-align: center; margin-bottom: 32px;
  .auth-logo { width: 56px; height: 56px; margin: 0 auto 16px; background: $gradient-primary; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: $shadow-glow; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  p { color: $text-secondary; font-size: 14px; }
}
.auth-form {
  :deep(.el-input__wrapper) { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); box-shadow: none;
    &:hover { border-color: rgba(255,255,255,0.15); }
    &.is-focus { border-color: $primary; }
  }
  :deep(.el-input__inner) { color: $text-primary; }
  :deep(.el-input__prefix-inner) { color: $text-muted; }
}
.auth-input :deep(.el-input__wrapper) { border-radius: $radius-md; padding: 4px 16px; }
.auth-btn { width: 100%; height: 44px; border-radius: $radius-md; font-size: 15px; font-weight: 600; border: none; background: $gradient-primary; &:hover { opacity: 0.9; } }
.auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: $text-secondary;
  a { color: $primary-light; text-decoration: none; font-weight: 500;
    &:hover { text-decoration: underline; }
  }
}
</style>
