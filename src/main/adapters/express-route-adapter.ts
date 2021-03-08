import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest:HttpRequest = {
    body: req.body,
  };
  console.log(httpRequest.body);
  const httpResponse = await controller.handle(httpRequest);
  if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
    res.status(httpResponse.statusCode).send(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).send({ error: httpResponse.body.message });
  }
};
