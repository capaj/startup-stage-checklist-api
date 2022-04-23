import { configDefaults, defineConfig } from 'vitest/config'
console.log('~ configDefaults', configDefaults)
import typescript from 'rollup-plugin-typescript2'
import rtti from 'typescript-rtti/dist/transformer'

const transformer = (service) => ({
  before: [rtti(service.getProgram())],
  after: []
})

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      transformers: [transformer]
    })
  ],
  test: configDefaults,
  resolve: {
    dedupe: ['graphql'],

    alias: [
      {
        find: /^decapi$/,
        replacement: 'node_modules/decapi/dist/esm/'
      }
    ]
  },
  esbuild: false
  // optimizeDeps: {
  //   exclude: ['graphql']
  // }
})
