export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // 初始化认证状态
  authStore.init()
  
  // 如果用户未认证，重定向到登录页
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
}) 