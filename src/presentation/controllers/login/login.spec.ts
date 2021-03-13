import { InvalidParamError, MissingParamError } from '../../errors';
import { LoginController } from './login';
import {
  EmailValidator, HttpRequest,
} from '../signup/signup-protocols';
import { serverError } from '../../helpers/http-helper';

interface SutTypes {
  sut: LoginController,
  emailValidatorStub: EmailValidator,
  }
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'anymail@mail.com',
    password: 'anyPassword',
  },
});

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'anypassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValid = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(makeFakeRequest());
    expect(isValid).toHaveBeenCalledWith('anymail@mail.com');
  });

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
