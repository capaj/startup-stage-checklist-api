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
  Arg,
  Context
} from 'decapi'
import { GraphQLID } from 'graphql'
import { IContext } from './IContext'
import { genId } from './genId'

export class ConstructorAssigner<T = any> {
  constructor(parameters: Partial<T>) {
    Object.assign(this, parameters)
  }
}

@DuplexObjectType()
export class Todo extends ConstructorAssigner {
  @Field({ type: GraphQLID })
  id: string
  @DuplexField()
  title: string

  @DuplexField()
  completedAt: Date | null
}

@ObjectType()
export class Stage extends ConstructorAssigner {
  @Field({ type: GraphQLID })
  id: string

  @DuplexField()
  title: string

  @Field()
  todos: Todo[]

  @Field()
  todo(@Arg({ type: GraphQLID }) id: string): Todo | undefined {
    return this.todos.find(({ id: todoId }) => todoId === id)
  }

  @Field()
  completed() {
    return this.todos.every(({ completedAt }) => completedAt)
  }
}

@ObjectType()
export class StageMutation extends Stage {
  title: string

  @Field()
  edit(title: string): Stage {
    this.title = title
    return this
  }

  todos: TodoMutation[]

  @Field()
  todo(@Arg({ type: GraphQLID }) id: string): TodoMutation | undefined {
    return this.todos.find(({ id: todoId }) => todoId === id)
  }

  @Field()
  removeTodo(@Arg({ type: GraphQLID }) id: string): Stage {
    this.todos = this.todos.filter((s) => s.id !== id)
    return this
  }

  @Field()
  addTodo(): Stage {
    this.todos.push(
      new TodoMutation({ id: genId(), title: '', completedAt: null })
    )
    return this
  }
}

@ObjectType()
export class TodoMutation extends Todo {
  @Field()
  edit(title: string): Todo {
    this.title = title
    return this
  }
  @Field({ description: 'default to true' })
  complete(completed: boolean | null): Todo {
    this.completedAt = completed === false ? new Date() : null
    return this
  }
}

@DuplexObjectType()
export class Startup extends ConstructorAssigner {
  @Field({ type: GraphQLID })
  id: string
  @DuplexField()
  name: string

  @Field()
  stages: Stage[]

  @Field()
  stage(id: string): Stage | undefined {
    return this.stages.find((s) => s.id === id)
  }
}

@ObjectType()
export class StartupMutation extends Startup {
  @Field()
  removeStage(@Arg({ type: GraphQLID }) id: string): Startup {
    this.stages = this.stages.filter((s) => s.id !== id)
    return this
  }

  @Field()
  stages: StageMutation[]

  @Field()
  addStage(title: string): Startup {
    this.stages.push(new StageMutation({ id: genId(), title, todos: [] }))
    return this
  }

  @Field()
  stage(id: string): StageMutation | undefined {
    return this.stages.find((s) => s.id === id)
  }
}

@SchemaRoot()
export class StartupStageChecklistSchema {
  @QueryAndMutation()
  startup(
    @Arg({ type: GraphQLID }) id: string,
    @Context ctx: IContext
  ): StartupMutation | undefined {
    return ctx.db.find(({ id: sId }) => sId === id)
  }

  @Query({ type: [Startup] })
  startups(@Context ctx: IContext): Startup[] {
    return ctx.db
  }

  @Mutation()
  addStartup(name: string, @Context ctx: IContext): StartupMutation {
    const startup = new StartupMutation({ id: genId(), name, stages: [] })
    ctx.db.push(startup)
    return startup
  }

  @Mutation()
  removeStartup(id: string, @Context ctx: IContext): string {
    ctx.db = ctx.db.filter((s) => s.id !== id)
    return id
  }
}

export const gqlSchema = compileSchema(StartupStageChecklistSchema)
