import { MissingParamError } from '../../errors';
import { LoginController } from './login';

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: 'anypassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
});
