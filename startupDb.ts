import { TodoMutation, Todo, StartupMutation } from './gqlSchema'
import { genId } from './genId'
export const startupDB: StartupMutation[] = [
  new StartupMutation({
    id: genId(),
    name: 'Crave tech',
    stages: [
      new TodoMutation({
        id: genId(),
        title: 'Foundation',
        todos: [
          new Todo({ id: genId(), title: 'Setup virtual office' }),
          new Todo({ id: genId(), title: 'Set mission and vision' }),
          new Todo({ id: genId(), title: 'select business name' }),
          new Todo({ id: genId(), title: 'buy domains' }),
        ],
      }),
      new TodoMutation({
        id: genId(),
        title: 'Discovery',
        todos: [
          new Todo({ id: genId(), title: 'Roadmap' }),
          new Todo({ id: genId(), title: 'Competitor analysis' }),
        ],
      }),
      new TodoMutation({
        id: genId(),
        title: 'Delivery',
        todos: [
          new Todo({ id: genId(), title: 'Mvp' }),
          new Todo({ id: genId(), title: 'Launch' }),
        ],
      }),
    ],
  }),
]

console.log(startupDB[0].id)
