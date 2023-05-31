import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import config from '../config';
import bcrypt from 'bcrypt';

const userModel = new UserModel();

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.create(req.body);
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    res.json({
      status: 'success',
      data: { ...user, token },
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.index();

    res.json({
      status: 'success',
      data: { ...users },
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.show(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.update(req.body);
    res.json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.delete(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.authenticate(
      req.body.username,
      req.body.password
    );
    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        massage: 'The username and password don not match, please try again',
      });
    }
    res.json({
      status: 'Success',
      data: { ...user, token },
    });
  } catch (err) {
    next(err);
  }
};

export { create, index, show, update, deleteOne, authenticate };
