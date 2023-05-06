import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
  // const user = await knex('users')
  //   .insert({
  //     id: crypto.randomUUID(),
  //     name: 'Test New',
  //     created_at: new Date(),
  //   })
  //   .returning('*')
  // const schema = await knex('sqlite_schema').select('*')
  const users = await knex('users').select('*')

  return users
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
