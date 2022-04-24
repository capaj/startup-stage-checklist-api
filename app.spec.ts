import { gqlSchema } from './gqlSchema'
import { graphql } from 'graphql'
import { startupDB } from './startupDb'
import { mock, unmock } from 'proxy-date'

const execGql = (source) =>
  graphql({
    contextValue: { db: startupDB },
    schema: gqlSchema,
    source,
  })

// fake graphql template tag literal just so that we get vscode syntax highlighting
const gql = (src) => {
  return src[0]
}

describe('suite name', () => {
  beforeAll(() => {
    mock('2023-01-19T00:20:20.654Z')
  })
  afterAll(() => {
    unmock()
  })

  it('should query all data about startup, stages and todos', async () => {
    const res = await execGql(gql`
      {
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
    `)
    expect(res).toMatchSnapshot()
  })

  it('should add/remove a startup', async () => {
    const res = await execGql(gql`
      mutation {
        addStartup(name: "Oak's lab") {
          id
          name
        }
      }
    `)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "addStartup": Object {
            "id": "3f5",
            "name": "Oak's lab",
          },
        },
      }
    `)

    const res2 = await execGql(gql`
      mutation {
        removeStartup(id: "3f5")
      }
    `)
    expect(res2).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "removeStartup": true,
        },
      }
    `)
  })
  it('should add/remove a todo', async () => {
    const res = await execGql(gql`
      mutation {
        startup(id: "3e9") {
          name
          id

          stage(id: "3ea") {
            id
            addTodo(title: "Create a new todo") {
              id
              title
              completedAt
            }
          }
        }
      }
    `)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "id": "3e9",
            "name": "Crave tech",
            "stage": Object {
              "addTodo": Object {
                "completedAt": null,
                "id": "3f6",
                "title": "Create a new todo",
              },
              "id": "3ea",
            },
          },
        },
      }
    `)

    const res2 = await execGql(gql`
      mutation {
        startup(id: "3e9") {
          stage(id: "3ea") {
            removeTodo(id: "3f6")
          }
        }
      }
    `)
    expect(res2).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "stage": Object {
              "removeTodo": true,
            },
          },
        },
      }
    `)
  })

  it('should add/remove a stage', async () => {
    const res = await execGql(gql`
      mutation {
        startup(id: "3e9") {
          addStage(title: "Foundation2") {
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
    `)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "addStage": Object {
              "completed": true,
              "id": "3f7",
              "title": "Foundation2",
              "todos": Array [],
            },
          },
        },
      }
    `)
    const res2 = await execGql(gql`
      mutation {
        startup(id: "3e9") {
          removeStage(id: "3f7")
        }
      }
    `)
    expect(res2).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "removeStage": true,
          },
        },
      }
    `)
  })

  it('should mark todo as complete', async () => {
    const res = await execGql(gql`
      mutation {
        startup(id: "3e9") {
          name
          id

          stage(id: "3ea") {
            id
            todo(id: "3eb") {
              complete {
                completedAt
              }
            }
          }
        }
      }
    `)

    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "id": "3e9",
            "name": "Crave tech",
            "stage": Object {
              "id": "3ea",
              "todo": Object {
                "complete": Object {
                  "completedAt": 2023-01-19T00:20:20.654Z,
                },
              },
            },
          },
        },
      }
    `)
  })

  it('should complete a stage when all todos in a stage are complete', async () => {
    await execGql(gql`
      mutation {
        startup(id: "3e9") {
          name
          id

          stage(id: "3f2") {
            id
            first: todo(id: "3f3") {
              complete {
                completedAt
              }
            }
            second: todo(id: "3f4") {
              complete {
                completedAt
              }
            }
          }
        }
      }
    `)
    const res = await execGql(gql`
      {
        startup(id: "3e9") {
          name
          id

          stage(id: "3f2") {
            id
            completed
          }
        }
      }
    `)
    expect(res).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "startup": Object {
            "id": "3e9",
            "name": "Crave tech",
            "stage": Object {
              "completed": true,
              "id": "3f2",
            },
          },
        },
      }
    `)
  })
})
