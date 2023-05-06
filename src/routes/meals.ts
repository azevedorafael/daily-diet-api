import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const users = await knex('users').select('*')

    return users
  })
}
