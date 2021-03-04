import { Request, Response, NextFunction } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set('acess-control-allow-origem', '*');
  res.set('acess-control-allow-methods', '*');
  res.set('acess-control-allow-headers', '*');
  next();
};
