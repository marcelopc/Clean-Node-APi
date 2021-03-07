import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http-helper';
import {
  HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
