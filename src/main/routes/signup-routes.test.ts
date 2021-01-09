import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Ana Beatriz',
        email: 'anabtz@mail.com',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(200)
  })
})
