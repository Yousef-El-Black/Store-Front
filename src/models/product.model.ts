import db from '../database';
import config from '../config';
import bcrypt from 'bcrypt';
import Product from '../types/product.type';
import { NextFunction } from 'express';

class ProductModel {
  // Show All Products
  async index(): Promise<Product[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error at showing products ${err as Error}.message`);
    }
  }

  // Show One Product By Id
  async show(id: string): Promise<Product> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Error at getting product: (${id}) ${err as Error}.message`
      );
    }
  }

  // Create Product
  async create(p: Product): Promise<Product> {
    try {
      const conn = await db.connect();
      const sql = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING id, name, price, category`;
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Create (${p.name}): ${err as Error} Message`);
    }
  }

  // Update Product
  async update(p: Product): Promise<Product> {
    try {
      const conn = await db.connect();
      const sql =
        'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING id, name, price, category';
      const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Update (${p.name}): ${err as Error} Message`);
    }
  }
  // Delete Product
  async delete(id: string): Promise<Product> {
    try {
      const conn = await db.connect();
      const sql =
        'DELETE FROM products WHERE id=$1 RETURNING id, name, price, category';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Delete (${id}): ${err as Error} Message`);
    }
  }
}

export default ProductModel;
