import request from 'supertest';
import app from '../config/app';

describe('CSigUp Routese', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Marcelo',
        email: 'marcelopc04@gmail.com',
        password: '12345678',
        passwordConfirmation: '12345678',

      })
      .expect(200);
  });
});
