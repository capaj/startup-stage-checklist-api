import { Todo, StartupMutation, StageMutation } from './gqlSchema'
import { genId } from './genId'

const startup = new StartupMutation({
  id: genId(),
  name: 'Crave tech',
  stages: [],
})

startup.stages = [
  new StageMutation({
    id: genId(),
    title: 'Foundation',
    todos: [
      new Todo({ startup, id: genId(), title: 'Setup virtual office' }),
      new Todo({ startup, id: genId(), title: 'Set mission and vision' }),
      new Todo({ startup, id: genId(), title: 'select business name' }),
      new Todo({ startup, id: genId(), title: 'buy domains' }),
    ],
    startup,
  }),
  new StageMutation({
    id: genId(),
    title: 'Discovery',
    todos: [
      new Todo({ startup, id: genId(), title: 'Roadmap' }),
      new Todo({ startup, id: genId(), title: 'Competitor analysis' }),
    ],
    startup,
  }),
  new StageMutation({
    id: genId(),
    title: 'Delivery',
    todos: [
      new Todo({ startup, id: genId(), title: 'Mvp' }),
      new Todo({ startup, id: genId(), title: 'Launch' }),
    ],
    startup,
  }),
]

export const startupDB: StartupMutation[] = [startup]
