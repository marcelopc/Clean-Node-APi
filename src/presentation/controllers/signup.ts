import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFilds = ['name', 'email', 'password'];

    for (const fild of requiredFilds) {
      if (!httpRequest.body[fild]) {
        return badRequest(new MissingParamError(fild));
      }
    }

    return { statusCode: 200, body: 'teste' };
  }
}
