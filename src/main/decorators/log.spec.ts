import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller
}

const makeController = ():Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name',
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = ():SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe('Log Controller Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation',
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test('should return the same resultof the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
      },
    });
  });
});
