import { gqlSchema } from './gqlSchema'

import Fastify from 'fastify'
import mercurius from 'mercurius'
import './generateGqlSchema'

const app = Fastify()

app.register(mercurius, {
  schema: gqlSchema,
  graphiql: true,
})

app.listen(3003)
