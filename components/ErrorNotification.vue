<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="visible"
        class="error-notification"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="notification-text">
            <h3 class="notification-title">
              {{ title || '错误' }}
            </h3>
            <div class="notification-message">
              {{ message }}
            </div>
          </div>
          <div class="notification-close">
            <button @click="close" class="close-button">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  visible: boolean
  title?: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  duration: 5000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(props.visible)

// 自动关闭
let timer: NodeJS.Timeout | null = null

const close = () => {
  visible.value = false
  emit('close')
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

watch(() => props.visible, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}, { immediate: true })
</script>

<style scoped>
.error-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  max-width: 24rem;
  min-width: 20rem;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: #f56565;
}

.notification-icon svg {
  width: 100%;
  height: 100%;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #c53030;
  margin: 0 0 0.25rem 0;
}

.notification-message {
  font-size: 0.875rem;
  color: #742a2a;
  margin: 0;
}

.notification-close {
  flex-shrink: 0;
}

.close-button {
  background: transparent;
  border: none;
  color: #f56565;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #c53030;
  background: rgba(245, 101, 101, 0.1);
}

.close-button svg {
  width: 100%;
  height: 100%;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 