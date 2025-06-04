<template>
  <div class="register-page">
    <div class="background-overlay"></div>
    <div class="register-container">
      <div class="register-card">
        <!-- Logo和标题区域 -->
        <div class="header-section">
          <div class="logo-container">
            <div class="logo-circle">
              <span class="logo-icon">🤖</span>
            </div>
          </div>
          <h1 class="brand-title">DiFlow</h1>
          <p class="brand-subtitle">创建您的账户，开启AI之旅</p>
        </div>

        <!-- 表单区域 -->
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">
              <span class="label-icon">👤</span>
              用户名
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              <span class="label-icon">🔒</span>
              密码
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              <span class="label-icon">🔐</span>
              确认密码
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入密码"
              required
            />
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="!username || !password || !confirmPassword || isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else class="button-icon">✨</span>
            {{ isLoading ? '注册中...' : '立即注册' }}
          </button>
        </form>

        <!-- 分割线 -->
        <div class="divider">
          <span class="divider-text">或</span>
        </div>

        <!-- 登录链接 -->
        <div class="login-section">
          <p class="login-text">已有账户？</p>
          <NuxtLink to="/auth/login" class="login-link">
            <span class="link-icon">🚀</span>
            立即登录
          </NuxtLink>
        </div>
      </div>

      <!-- 装饰元素 -->
      <div class="decoration-elements">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
      </div>
    </div>

    <!-- 错误通知组件 -->
    <ErrorNotification
      :visible="notificationState.visible"
      :title="notificationState.title"
      :message="notificationState.message"
      :duration="notificationState.duration"
      @close="hideError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 页面元数据
definePageMeta({
  layout: false,
  middleware: []
})

// 响应式数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

// 状态管理
const authStore = useAuthStore()

// 错误通知
const { notificationState, showApiError, hideError, showError } = useErrorNotification()

// 处理注册
const handleRegister = async () => {
  // 验证输入
  if (!username.value || !password.value || !confirmPassword.value) {
    showError('请填写所有字段')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showError('两次输入的密码不一致')
    return
  }

  if (password.value.length < 6) {
    showError('密码长度至少为6个字符')
    return
  }
  
  isLoading.value = true
  
  try {
    await authStore.register({ 
      username: username.value, 
      password: password.value 
    })
    
    // 注册成功后直接跳转到登录页面，让用户手动登录
    await navigateTo('/auth/login', { replace: true })
  } catch (error: any) {
    console.log('注册错误:', error)
    showApiError(error)
  } finally {
    isLoading.value = false
  }
}

// 检查是否已登录
onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/', { replace: true })
  }
})
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  animation: backgroundShift 20s ease-in-out infinite;
}

@keyframes backgroundShift {
  0%, 100% { transform: translateX(0) translateY(0); }
  33% { transform: translateX(-20px) translateY(-10px); }
  66% { transform: translateX(20px) translateY(10px); }
}

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  animation: cardFloat 6s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #7673fe 0%, #6e47d9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  animation: logoSpin 3s ease-in-out infinite;
}

@keyframes logoSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
}

.logo-icon {
  font-size: 40px;
}

.brand-title {
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 0;
}

.register-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.label-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(118, 75, 162, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.button-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
}

.divider-text {
  padding: 0 1rem;
  color: #888;
}

.login-section {
  text-align: center;
}

.login-text {
  color: #666;
  margin-bottom: 0.5rem;
}

.login-link {
  display: inline-flex;
  align-items: center;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #764ba2;
  }
}

.link-icon {
  margin-right: 0.5rem;
}

.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.5) 0%, rgba(102, 126, 234, 0) 70%);
  top: -100px;
  right: 10%;
  animation: float1 15s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.5) 0%, rgba(118, 75, 162, 0) 70%);
  bottom: -150px;
  left: -150px;
  animation: float2 20s ease-in-out infinite;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 183, 77, 0.5) 0%, rgba(255, 183, 77, 0) 70%);
  top: 30%;
  left: -75px;
  animation: float3 18s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 20px); }
}
</style>