import { promises } from 'fs';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
      this.emailValidator = emailValidator;
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      try {
        const requiredFields = ['email', 'password'];

        for (const field of requiredFields) {
          if (!httpRequest.body[field]) {
            return badRequest(new MissingParamError(field));
          }
        }

        const { email, password } = httpRequest.body;

        if (!this.emailValidator.isValid(email)) {
          return badRequest(new InvalidParamError('email'));
        }

        return new Promise((resolve) => resolve({ statusCode: 200, body: {} }));
      } catch (error) {
        return serverError(error);
      }
    }
}