<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- 导航组件 -->
    <TheNavigation />
    
    <!-- 主要内容区域 -->
    <main class="pt-16 ml-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// 初始化认证状态
const authStore = useAuthStore()
onMounted(() => {
  authStore.init()
})
</script> 