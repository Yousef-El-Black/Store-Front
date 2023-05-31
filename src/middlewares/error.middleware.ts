import { Request, Response } from "express";
import Error from "../interfaces/error.interface";

const errorMiddleware = (error: Error, _req: Request, res: Response) => {
  const status = error.status || 500;
  const message = error.message || "Whoops!! Something is Wrong.";
  res.status(status).json({
    message: message,
  });
};

export default errorMiddleware;
