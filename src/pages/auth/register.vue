<template>
  <div class="auth-page">
    <div class="auth-bg">
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
    </div>

    <div class="auth-card glass">
      <div class="auth-header">
        <div class="auth-logo">
          <Icon icon="carbon:music" width="28" height="28" />
        </div>
        <h1>创建账号</h1>
        <p>加入音乐世界</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="auth-form"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
            class="auth-input"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            :prefix-icon="Message"
            size="large"
            class="auth-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            class="auth-input"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            class="auth-input"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="auth-btn"
          :loading="loading"
          @click="handleRegister"
        >
          {{ loading ? '注册中...' : '注册' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        已有账号?
        <router-link to="/login" class="register-link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { authApi } from '@/api/modules/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validatePass = (_rule: any, value: string, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }],
}

async function handleRegister() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      await authApi.register(form.username, form.password, form.email)
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (e: any) {
      ElMessage.error(e.message || '注册失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.auth-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-dark;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;

  &.orb-1 {
    width: 500px;
    height: 500px;
    background: #6366f1;
    top: -100px;
    right: -100px;
    animation: float 8s ease-in-out infinite;
  }

  &.orb-2 {
    width: 400px;
    height: 400px;
    background: #8b5cf6;
    bottom: -100px;
    left: -100px;
    animation: float 6s ease-in-out infinite reverse;
  }
}

.auth-card {
  width: 420px;
  padding: 40px;
  border-radius: $radius-xl;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;

  .auth-logo {
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    background: $gradient-primary;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: $text-secondary;
    font-size: 14px;
  }
}

.auth-form {
  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: none;

    &:hover {
      border-color: rgba(255, 255, 255, 0.15);
    }

    &.is-focus {
      border-color: #6366f1;
    }
  }

  :deep(.el-input__inner) {
    color: #e5e5e5;
  }

  :deep(.el-input__prefix-inner) {
    color: #6b7280;
  }
}

.auth-input {
  :deep(.el-input__wrapper) {
    border-radius: 10px;
    padding: 4px 16px;
  }
}

.auth-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

  &:hover {
    opacity: 0.9;
  }
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #a3a3a3;
}

.register-link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}
</style>
