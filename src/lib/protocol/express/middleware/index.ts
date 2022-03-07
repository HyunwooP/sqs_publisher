import { NextFunction, Request, Response } from "express";

const middlewareController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // todo: 확장할 것이 있다면 여기에...
  next();
};

export default middlewareController;
