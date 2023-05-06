import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

const TABLE_NAME = 'users'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex(TABLE_NAME).select('*')

    return { users }
  })

  app.get('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getUserParamsSchema.parse(request.params)
    const user = await knex('users').where('id', id).first()

    return { user }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    await knex(TABLE_NAME).insert({
      id: randomUUID(),
      name,
    })

    reply.status(201).send()
  })
}
