import { gqlSchema } from './gqlSchema'
import { graphql } from 'graphql'
import { startupDB } from './startupDb'

describe('suite name', () => {
  it('should query all data about startup, stages and todos', async () => {
    const res = await graphql({
      contextValue: { db: startupDB },
      schema: gqlSchema,
      source: `{
        startups {
          id
          name
          stages {
            id
            title
            completed
            todos {
              id
              title
              completedAt
            }
          }
        }
      }
    `,
    })
    expect(res).toMatchSnapshot()
  })

  it
})
