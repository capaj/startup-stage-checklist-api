import {
  SchemaRoot,
  Query,
  Mutation,
  Field,
  ObjectType,
  compileSchema,
  DuplexObjectType,
  DuplexField,
  QueryAndMutation,
} from 'decapi'
import { GraphQLInt } from 'graphql'

export class ConstructorAssigner<T = any> {
  constructor(parameters: Partial<T>) {
    Object.assign(this, parameters)
  }
}

@DuplexObjectType()
class Stage extends ConstructorAssigner {
  @Field({ type: GraphQLInt })
  id: number
  @DuplexField()
  title: string

  @DuplexField()
  completedAt: Date | null
}

@ObjectType()
class StageMutation extends Stage {
  @Field()
  edit(title: string): Stage {
    this.title = title
    return this
  }
  @Field()
  complete(): Stage {
    this.completedAt = new Date()
    return this
  }
  @Field()
  remove(): number {
    startupDB = startupDB.filter((s) => s.id !== this.id)
    return startupDB.length
  }
}

@DuplexObjectType()
class Startup extends ConstructorAssigner {
  @Field({ type: GraphQLInt })
  id: number
  @DuplexField()
  name: string

  @Field()
  stages: StageMutation[]
}

let startupDB: Startup[] = [
  {
    id: 1,
    name: 'Crave tech',
    stages: [
      new StageMutation({ id: 1, name: 'Lord of the Rings' }),
      new StageMutation({ id: 2, name: 'Harry Potter' }),
    ],
  },
]

@SchemaRoot()
class StartupStageChecklistSchema {
  @QueryAndMutation()
  startup(id: number): Startup | undefined {
    return startupDB.find(({ id: sId }) => sId === id)
  }

  @Query({ type: [Startup] })
  startups(): Startup[] {
    return startupDB
  }
}

export const gqlSchema = compileSchema(StartupStageChecklistSchema)
