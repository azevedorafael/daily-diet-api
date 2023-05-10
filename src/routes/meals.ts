import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

const TABLE_NAME = 'meals'

export async function mealsRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (request, reply) => {
  //   console.log(`[${request.method}] ${request.url}`)
  // })

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

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getMealParamsSchema.parse(request.params)
      const { userId } = request.cookies

      const meal = await knex(TABLE_NAME)
        .select()
        .where('id', id)
        .and.where('user_id', userId)

      return { meal }
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies
      const totalMealsAcount: number = Number(
        (await knex(TABLE_NAME).where('user_id', userId).count())[0][
          'count(*)'
        ],
      )
      const totalMealsAcountWithinDiet = Number(
        (
          await knex(TABLE_NAME)
            .where('user_id', userId)
            .and.where('within_diet', true)
            .count()
        )[0]['count(*)'],
      )

      let bestSequenceWithinDiet = 0
      const sequencesInsideTheDiet = await knex(TABLE_NAME)
        .where('user_id', userId)
        .and.where('within_diet', true)
        .groupBy('created_at')
        .count()

      sequencesInsideTheDiet.forEach((element) => {
        const mealsInsideTheDiet = Number(element['count(*)'])
        if (mealsInsideTheDiet > bestSequenceWithinDiet) {
          bestSequenceWithinDiet = mealsInsideTheDiet
        }
      })

      return {
        totalMealsAcount,
        totalMealsAcountWithinDiet,
        totalMealsAcountOutOfDiet:
          totalMealsAcount - totalMealsAcountWithinDiet,
        bestSequenceWithinDiet,
      }
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

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getMealParamsSchema.parse(request.params)
      const createUserBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string().datetime(),
        withinDiet: z.boolean(),
      })

      const { name, description, dateTime, withinDiet } =
        createUserBodySchema.parse(request.body)
      const { userId } = request.cookies

      await knex(TABLE_NAME)
        .update({
          name,
          description,
          created_at: dateTime,
          within_diet: withinDiet,
        })
        .where('id', id)
        .and.where('user_id', userId)

      reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getMealParamsSchema.parse(request.params)
      const { userId } = request.cookies

      await knex(TABLE_NAME)
        .delete()
        .where('id', id)
        .and.where('user_id', userId)

      reply.status(201).send()
    },
  )
}
