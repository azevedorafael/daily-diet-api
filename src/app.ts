import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

// GET, POST, PUT, PATCH, DELETE

export const app = fastify()

app.register(cookie)
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
