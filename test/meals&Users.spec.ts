import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals & Users routes', () => {
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

  it('should be able to create a new meal', async () => {
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

  it('should be able to list all meals', async () => {
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

  it('should be able to list one meal by id', async () => {
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
    const { id } = listMealsResponse.body.meals[0]

    const listSingleMealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)

    expect(listSingleMealResponse.body.meal).toEqual([
      expect.objectContaining({
        name: 'New Test Meal to get Cookie',
        description: 'New Test Meal to get Cookie',
        within_diet: 1,
        user_id: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
      }),
    ])
  })

  it('should be able to delete one meal by id', async () => {
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
    const { id } = listMealsResponse.body.meals[0]

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(201)

    const emptyListMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
    expect(emptyListMealsResponse.statusCode).toEqual(200)
    expect(emptyListMealsResponse.body.meals).toHaveLength(0)
  })

  it('should be able to update details of one meal by id', async () => {
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
    const { id } = listMealsResponse.body.meals[0]

    await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Edited New Test Meal to get Cookie',
        description: 'Edited New Test Meal to get Cookie',
        withinDiet: false,
        dateTime: '2023-05-30T23:15:04.929Z',
      })
      .expect(201)

    const emptyListMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
    expect(emptyListMealsResponse.statusCode).toEqual(200)
    expect(emptyListMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        created_at: '2023-05-30T23:15:04.929Z',
        description: 'Edited New Test Meal to get Cookie',
        name: 'Edited New Test Meal to get Cookie',
        user_id: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
        within_diet: 0,
      }),
    ])
  })

  it('should be able to list metrics', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'New Test Meal to get Cookie',
      description: 'New Test Meal to get Cookie',
      withinDiet: true,
      userId: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
    })
    const cookies = createMealResponse.get('Set-Cookie')
    await request(app.server).post('/meals').send({
      name: 'Another New Test Meal to get Cookie',
      description: 'Another New Test Meal to get Cookie',
      withinDiet: true,
      userId: '2f919083-c7e3-40eb-8a09-e8b05de88fb1',
    })
    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
    expect(metricsResponse.statusCode).toEqual(200)
    expect(metricsResponse.body).toEqual(
      expect.objectContaining({
        totalMealsAcount: 2,
        totalMealsAcountWithinDiet: 2,
        totalMealsAcountOutOfDiet: 0,
        bestSequenceWithinDiet: 2,
      }),
    )
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'New Test User',
      })
      .expect(201)
  })

  it('should be able to list all users', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'New Test User',
      })
      .expect(201)

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const listUsersResponse = await request(app.server).get('/users')
    expect(listUsersResponse.statusCode).toEqual(200)
    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'New Test User',
      }),
      expect.objectContaining({
        name: 'John Doe',
      }),
    ])
  })

  it('should be able to get a single user by id', async () => {
    await request(app.server).post('/users').send({
      name: 'New Test User',
    })
    await request(app.server).post('/users').send({
      name: 'John Doe',
    })

    const listUsersResponse = await request(app.server).get('/users')
    expect(listUsersResponse.statusCode).toEqual(200)
    const { id } = listUsersResponse.body.users[1]

    const listSingleUserResponse = await request(app.server).get(`/users/${id}`)
    expect(listSingleUserResponse.statusCode).toEqual(200)
    console.log(listSingleUserResponse.body)
    expect(listSingleUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    )
  })
})
