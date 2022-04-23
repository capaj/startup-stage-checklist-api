import { gqlSchema, Startup } from './gqlSchema'

import Fastify from 'fastify'
import mercurius from 'mercurius'
import './generateGqlSchema'
import { startupDB } from './startupDb'

const app = Fastify()

app.register(mercurius, {
  schema: gqlSchema,
  graphiql: true,
  context: () => {
    return { db: startupDB }
  }
})

app.listen(3004, () => {
  console.log('Server listening on port 3004')
  console.log('GraphiQL available at http://localhost:3004/graphiql')
})
