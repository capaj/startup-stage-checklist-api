import { configDefaults, defineConfig } from 'vitest/config'

import typescript from 'rollup-plugin-typescript2'
import rtti from 'typescript-rtti/dist/transformer/index.js'

const transformer = (service) => ({
  // @ts-expect-error
  before: [rtti.default(service.getProgram())],
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
    dedupe: ['graphql']
  },
  esbuild: false
})
