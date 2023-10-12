import { defineNuxtModule, useNuxt } from '@nuxt/kit'
import { defu } from 'defu'

export default defineNuxtModule({
  meta: {
    name: 'web3',
  },
  setup() {
    const nuxt = useNuxt()
    
    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      if (!isClient) return
      
      config.resolve = defu(config.resolve, {
        alias: {
          'micro-ftch': 'node-fetch-native',
          'crypto': 'uncrypto',
          'buffer': 'unenv/runtime/node/buffer/index',
          'http': 'unenv/runtime/mock/empty',
          'https': 'unenv/runtime/mock/empty',
          'zlib': 'unenv/runtime/mock/empty',
          'url': 'unenv/runtime/mock/empty',
        }
      })
      config.define = defu(config.define, {
        'process.version': '"undefined"',
        'global.btoa': 'globalThis.btoa',
        'global.crypto': 'globalThis.crypto',
        'global.msCrypto': 'globalThis.msCrypto',
      })

      config.plugins ||= []
      config.plugins.push({
        name: 'inject-buffer-import',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('unenv/runtime/node/buffer')) { return }

          if (code.includes('Buffer.from(') && !code.includes('unenv/runtime/node/buffer/index') && !code.includes('import { Buffer }') && !code.includes("require('buffer')")) {
            if (!nuxt.options.dev && (code.includes('require(') || code.includes('exports.'))) {
              return 'const { Buffer } = require("unenv/runtime/node/buffer/index");' + code
            }
            return 'import { Buffer } from "unenv/runtime/node/buffer/index";' + code
          }
        },
      })
    })
  },
})
