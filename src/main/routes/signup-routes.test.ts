import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helprs/mongo-helper';
import app from '../config/app';

describe('CSigUp Routese', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  });

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
