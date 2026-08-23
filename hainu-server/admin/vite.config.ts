import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { manualChunks, resolveHtmlPreloadDependencies } from './build/vite/chunks'
import { cssConfig } from './build/vite/css'
import { optimizeDepsConfig } from './build/vite/optimize-deps'
import { createVitePlugins } from './build/vite/plugins'

export default ({ mode }: { mode: string }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const {
    VITE_VERSION,
    VITE_PORT,
    VITE_BASE_URL,
    VITE_API_URL,
    VITE_API_PROXY_URL,
    VITE_BUILD_ID,
    VITE_VERSION_UPDATE_ENABLED,
    VITE_VERSION_FORCE_UPDATE,
    VITE_VERSION_UPDATE_MESSAGE
  } = env
  const isProd = mode === 'production'
  const buildTime = new Date().toISOString()
  const buildId =
    VITE_BUILD_ID ||
    process.env.VITE_BUILD_ID ||
    process.env.GIT_COMMIT_SHA ||
    `${VITE_VERSION}-${buildTime}`
  const versionUpdateEnabled = VITE_VERSION_UPDATE_ENABLED !== 'false'
  const versionInfo = {
    version: VITE_VERSION,
    ...(versionUpdateEnabled
      ? {
          buildId,
          buildTime
        }
      : {}),
    enabled: versionUpdateEnabled,
    forceUpdate: VITE_VERSION_FORCE_UPDATE === 'true',
    message: VITE_VERSION_UPDATE_MESSAGE || undefined
  }

  console.log(`🚀 API_URL = ${VITE_API_URL}`)
  console.log(`🚀 VERSION = ${VITE_VERSION}`)
  console.log(`🚀 BUILD_ID = ${buildId}`)

  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION),
      __APP_BUILD_ID__: JSON.stringify(buildId),
      'import.meta.env.VITE_API_URL': JSON.stringify(VITE_API_URL || ''),
      'import.meta.env.VITE_BASE_URL': JSON.stringify(VITE_BASE_URL || '/admin/')
    },
    base: VITE_BASE_URL,
    server: {
      port: Number(VITE_PORT),
      proxy: {
        '/api': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true
        },
        '/uploads': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true
        }
      },
      host: true
    },
    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': resolvePath('src/views'),
        '@imgs': resolvePath('src/assets/images'),
        '@icons': resolvePath('src/assets/icons'),
        '@utils': resolvePath('src/utils'),
        '@stores': resolvePath('src/store'),
        '@styles': resolvePath('src/assets/styles')
      }
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      minify: 'oxc',
      modulePreload: {
        resolveDependencies: (_url, deps, context) => {
          return context.hostType === 'html' ? resolveHtmlPreloadDependencies(deps) : deps
        }
      },
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              // 生产环境去除 console
              dropConsole: true,
              // 生产环境去除 debugger
              dropDebugger: true
            }
          },
          manualChunks
        }
      },
      dynamicImportVarsOptions: {
        include: ['src/views/**/*.vue']
      }
    },
    plugins: createVitePlugins(isProd, versionInfo),
    optimizeDeps: optimizeDepsConfig,
    css: cssConfig,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [],
      include: ['src/**/*.spec.ts']
    }
  })
}

function resolvePath(paths: string) {
  return path.resolve(__dirname, paths)
}
