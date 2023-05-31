import ProductModel from '../product.model';
import db from '../../database';
import Product from '../../types/product.type';
import { create } from 'domain';

const productModel = new ProductModel();

describe('Product Model', () => {
  describe('Test Methods Exists', () => {
    it('Should have an Show All Products Method', () => {
      expect(productModel.index).toBeDefined();
    });

    it('Should have an Show Product Method', () => {
      expect(productModel.show).toBeDefined();
    });

    it('Should have an Create Product Method', () => {
      expect(productModel.create).toBeDefined();
    });

    it('Should have an Update Product Method', () => {
      expect(productModel.update).toBeDefined();
    });

    it('Should have an Delete Product Method', () => {
      expect(productModel.delete).toBeDefined();
    });
  });

  describe('Test Product Model Logic', () => {
    const product = {
      name: 'product-name',
      price: '100',
      category: 'product-category',
    } as Product;

    beforeAll(async () => {
      const createdProduct = await productModel.create(product);
      product.id = createdProduct.id;
    });

    afterAll(async () => {
      const conn = await db.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('Create Method should return a New Product', async () => {
      const createdProduct = await productModel.create({
        name: 'product-name-2',
        price: '1002',
        category: 'product-category-2',
      } as Product);

      expect(createdProduct).toEqual({
        id: createdProduct.id,
        name: 'product-name-2',
        price: '1002',
        category: 'product-category-2',
      } as Product);
    });

    it('Show All Method should return All Available Products in DB', async () => {
      const products = await productModel.index();
      expect(products.length).toEqual(3);
    });

    it('Show One Method should return One Product when called with Id', async () => {
      const returnedProduct = await productModel.show(
        product.id as unknown as string
      );
      expect(returnedProduct.id).toBe(product.id);
      expect(returnedProduct.name).toBe(product.name);
      expect(returnedProduct.price).toBe(product.price);
      expect(returnedProduct.category).toBe(product.category);
    });

    it('Update One Method should return One Product when called with Id With Edited Info', async () => {
      const updatedProduct = await productModel.update({
        ...product,
        name: 'product-name-updated',
        price: '200',
        category: 'product-category-updated',
      });
      expect(updatedProduct.id).toBe(product.id);
      expect(updatedProduct.name).toBe('product-name-updated');
      expect(updatedProduct.price).toBe('200');
      expect(updatedProduct.category).toBe('product-category-updated');
    });

    it('Delete One Product Method should delete Product fron DB', async () => {
      const deletedProduct = await productModel.delete(
        product.id as unknown as string
      );
      expect(deletedProduct.id).toBe(product.id);
    });
  });
});
