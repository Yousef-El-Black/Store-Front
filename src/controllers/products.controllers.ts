import { NextFunction, Request, Response } from 'express';
import ProductModel from '../models/product.model';

const productModel = new ProductModel();

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.create(req.body);
    res.json({
      status: 'success',
      data: { ...product },
    });
  } catch (err) {
    next(err);
  }
};

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productModel.index();

    res.json({
      status: 'success',
      data: { ...products },
    });
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.show(req.params.id as unknown as string);
    res.json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.update(req.body);
    res.json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.delete(
      req.params.id as unknown as string
    );
    res.json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export { create, index, show, update, deleteOne };
