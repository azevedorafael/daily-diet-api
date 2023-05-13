import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('user should be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New Test Meal',
        description: 'New meal to test',
        withinDiet: true,
        userId: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
      })
      .expect(201)
  })

  it('user should be able to list all meals', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New Test Meal to get Cookie',
      description: 'New Test Meal to get Cookie',
      withinDiet: true,
      userId: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
    })
    const cookies = createMealResponse.get('Set-Cookie')
    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
    expect(listMealsResponse.statusCode).toEqual(200)
    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New Test Meal to get Cookie',
        description: 'New Test Meal to get Cookie',
        within_diet: 1,
        user_id: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
      }),
    ])
  })
})
