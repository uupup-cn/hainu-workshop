import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * 独立的 vitest 配置：不复用 vite.config.ts 里的 unplugin-element-plus / Components / AutoImport，
 * 因为它们会向源文件注入 scss 导入与全局组件，jsdom + vitest 的 ESM 加载器无法处理。
 *
 * 测试代码自行 import { ElXxx, ElMessageBox } from 'element-plus' 并通过 vi.mock 替换为桩件。
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': path.resolve(__dirname, 'src/views'),
      '@imgs': path.resolve(__dirname, 'src/assets/images'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@stores': path.resolve(__dirname, 'src/store'),
      '@styles': path.resolve(__dirname, 'src/assets/styles')
    }
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.spec.ts'],
    server: {
      deps: {
        // 让 element-plus 的样式文件不进入测试构建
        inline: []
      }
    }
  }
})
