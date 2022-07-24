import { assert, describe, expect, it } from 'vitest'
import { gqlSchema } from './gqlSchema'
import { startupDB } from './startupDb'

describe('suite name', () => {
  it('foo', () => {
    expect(gqlSchema).to.be.toBeTruthy()
  })

  it('should add new stage', async () => {
    startupDB[0].addStage('New stage')

    expect(startupDB[0].stages[3].title).to.be.toBe('New stage')
    expect(startupDB).toMatchSnapshot()
  })
})
