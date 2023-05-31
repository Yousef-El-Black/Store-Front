import { NextFunction, Request, Response } from 'express';
import OrderModel from '../models/order.model';

const orderModel = new OrderModel();

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.create(req.body);
    res.json({
      status: 'success',
      data: { ...order },
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderModel.index();

    res.json({
      status: 'success',
      data: { ...orders },
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.show(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.update(req.body);
    res.json({
      status: 'success',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderModel.delete(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderModel.getCurrentOrders(
      req.params.id as unknown as string
    );
    res.json({
      status: 'success',
      data: { ...orders },
    });
  } catch (err) {
    next(err);
  }
};

const addProductToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderProduct = await orderModel.addProductToOrder(req.body);
    res.json({
      status: 'success',
      data: { ...orderProduct },
    });
  } catch (err) {
    next(err);
  }
};

export {
  create,
  index,
  show,
  update,
  deleteOne,
  getCurrentOrders,
  addProductToOrder,
};
