<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="card-cartoon w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-blue-600 mb-2 float-animation">
          🤖 DiFlow
        </h1>
        <p class="text-gray-600">欢迎回来！请登录您的账户</p>
      </div>

      <a-form
        :model="form"
        @finish="handleLogin"
        layout="vertical"
        class="space-y-4"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            size="large"
            class="input-cartoon"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            size="large"
            class="input-cartoon"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="authStore.isLoading"
            class="w-full btn-cartoon btn-primary"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="text-center mt-6">
        <p class="text-gray-600">
          还没有账户？
          <NuxtLink
            to="/auth/register"
            class="text-blue-600 hover:text-blue-700 font-semibold"
          >
            立即注册
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { LoginRequest } from '~/types'

// 页面元数据
definePageMeta({
  layout: false,
  middleware: []
})

// 状态管理
const authStore = useAuthStore()

// 表单数据
const form = reactive<LoginRequest>({
  username: '',
  password: ''
})

// 处理登录
const handleLogin = async () => {
  try {
    await authStore.login(form)
    message.success('登录成功！')
    await navigateTo('/')
  } catch (error: any) {
    message.error(error.message || '登录失败')
  }
}

// 如果已登录，重定向到首页
onMounted(() => {
  authStore.init()
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})
</script>

<style scoped>
/* 自定义样式 */
.ant-input,
.ant-input-password {
  @apply input-cartoon;
}

.ant-btn-primary {
  @apply btn-cartoon btn-primary border-none;
}
</style> 