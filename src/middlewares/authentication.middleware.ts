import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Error from '../interfaces/error.interface';
import config from '../config';

const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error('login Error: Please try again');
  error.status = 401;
  next(error);
};

const validateTokenMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('Authorization');
    if (authHeader) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decode = jwt.verify(
          token,
          config.tokenSecret as unknown as string
        );
        if (decode) {
          next;
        } else {
          handleUnauthorizedError(next);
        }
      } else {
        handleUnauthorizedError(next);
      }
    } else {
      handleUnauthorizedError(next);
    }
    next();
  } catch (err) {
    handleUnauthorizedError(next);
  }
};

export default validateTokenMiddleware;
