import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

const TABLE_NAME = 'meals'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const meals = await knex(TABLE_NAME).where('user_id', userId).select()

      return { meals }
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      withinDiet: z.boolean(),
      userId: z.string(),
    })

    const { name, description, withinDiet, userId } =
      createUserBodySchema.parse(request.body)

    let cookieUserId = request.cookies.userId

    if (!cookieUserId) {
      // reply.status(401).send()

      cookieUserId = userId

      reply.cookie('userId', cookieUserId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex(TABLE_NAME).insert({
      id: randomUUID(),
      name,
      description,
      within_diet: withinDiet,
      user_id: userId,
    })

    reply.status(201).send()
  })
}
