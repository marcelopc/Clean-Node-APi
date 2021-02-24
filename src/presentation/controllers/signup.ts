import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const fild of requiredFilds) {
      if (!httpRequest.body[fild]) {
        return badRequest(new MissingParamError(fild));
      }
    }

    return { statusCode: 200, body: 'teste' };
  }
}
