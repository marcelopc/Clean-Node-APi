import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest, serverError } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const fild of requiredFilds) {
        if (!httpRequest.body[fild]) {
          return badRequest(new MissingParamError(fild));
        }
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'));
      }

      return { statusCode: 200, body: 'teste' };
    } catch (error) {
      return serverError();
    }
  }
}
