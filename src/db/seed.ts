import { client, db } from "."
import { goalCompletions, goals } from "./schema"

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db.insert(goals).values([
    { title: 'Acordar Cedo', desiredWeeklyFrequency: 5 },
    { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
    { title: 'Meditar', desiredWeeklyFrequency: 1 },
  ]).returning()

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: new Date() },
    { goalId: result[1].id, createdAt: new Date() }
  ])
}

seed().finally(() => {
  client.end()
})