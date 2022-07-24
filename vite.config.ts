import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

import typescript from 'rollup-plugin-typescript2'
import rtti from 'typescript-rtti/dist/transformer/index.js'

const transformer = (service) => ({
  // @ts-expect-error
  before: [rtti.default(service.getProgram())],
  after: []
})

export default defineConfig({
  // ...vite configures
  server: {
    // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
    port: 4000
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      transformers: [transformer]
    })
  ],
  optimizeDeps: {}
})
