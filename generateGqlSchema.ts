import { printSchema } from 'graphql'
import fs from 'fs/promises'
import prettier from 'prettier'
import { gqlSchema } from './gqlSchema'
;(async () => {
  await fs.writeFile(
    './schema.graphql',
    prettier.format(printSchema(gqlSchema), { parser: 'graphql' })
  )
  console.log('✅ backend schema written')
})()
