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
  Context,
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
export class TodoMutation extends Todo {
  @Field()
  edit(title: string): Todo {
    this.title = title
    return this
  }
  @Field({ description: 'default to true' })
  complete(completed: boolean | null): Todo {
    this.completedAt = completed === false ? null : new Date()
    return this
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
  removeTodo(@Arg({ type: GraphQLID }) id: string): boolean {
    const without = this.todos.filter((s) => s.id !== id)
    const removed = without.length + 1 === this.todos.length
    this.todos = without
    return removed
  }

  @Field()
  addTodo(title: string): TodoMutation {
    const todo = new TodoMutation({
      id: genId(),
      title: title,
      completedAt: null,
    })
    this.todos.push(todo)
    return todo
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
  removeStage(@Arg({ type: GraphQLID }) id: string): boolean {
    const without = this.stages.filter((s) => s.id !== id)
    const removed = without.length + 1 === this.stages.length
    this.stages = without
    return removed
  }

  @Field()
  stages: StageMutation[]

  @Field()
  addStage(title: string): StageMutation {
    const stage = new StageMutation({ id: genId(), title, todos: [] })
    this.stages.push(stage)
    return stage
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
  removeStartup(id: string, @Context ctx: IContext): boolean {
    const without = ctx.db.filter((s) => s.id !== id)
    const removed = without.length + 1 === ctx.db.length
    ctx.db = without
    return removed
  }
}

export const gqlSchema = compileSchema(StartupStageChecklistSchema)
