import fastify from 'fastify'
import { createGoal } from '../functions/create-goal'
import z from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../functions/get-week-pending-goals'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async request => {
    const { desiredWeeklyFrequency, title } = request.body
    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals()

  return { pendingGoals }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server running!')
    console.log('http://localhost:3333')
  })
