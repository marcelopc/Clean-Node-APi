import {
  HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, AddAccountModel,
} from './sigup-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const fild of requiredFilds) {
        if (!httpRequest.body[fild]) {
          return badRequest(new MissingParamError(fild));
        }
      }

      const {
        name, email, password, passwordConfirmation,
      } = httpRequest.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      this.addAccount.add({ name, email, password });

      return { statusCode: 200, body: 'teste' };
    } catch (error) {
      return serverError();
    }
  }
}
