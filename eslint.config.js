import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    'dist',
    'node_modules',
    '.output',
    '.nuxt',
    'prisma/migrations'
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off'
  }
}) 