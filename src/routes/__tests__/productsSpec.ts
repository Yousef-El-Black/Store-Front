import supertest from 'supertest';
import db from '../../database';
import ProductModel from '../../models/product.model';
import Product from '../../types/product.type';
import User from '../../types/user.type';
import app from '../../index';
import jwt from 'jsonwebtoken';
import config from '../../config';
import UserModel from '../../models/user.model';

const productModel = new ProductModel();
const userModel = new UserModel();
const request = supertest(app);
let token: string, userId: number;

describe('Product API Endpoints', () => {
  const product = {
    name: 'test-name-product',
    price: '222',
    category: 'test-category',
  } as Product;

  const user = {
    username: 'test-user-name-product',
    first_name: 'test-first-name-product',
    last_name: 'test-last-name-product',
    password_digest: 'test123-product',
  } as User;

  beforeAll(async () => {
    const createdProduct = await productModel.create(product);
    product.id = createdProduct.id;
    const userTwo = {
      username: 'producttester',
      first_name: 'Product',
      last_name: 'ccTester',
      password_digest: 'passsword123',
    };
    const response = await request.post('/api/users').send(userTwo);
    token = response.body.data.token;
  });

  afterAll(async () => {
    const conn = await db.connect();
    const sql = 'DELETE FROM products;';
    await conn.query(sql);
    conn.release();
  });

  describe('Test CRUD API methods', () => {
    it('Should create new product', async () => {
      const res = await request
        .post('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'test-name2',
          price: '2222',
          category: 'test-category2',
        } as Product);
      expect(res.status).toBe(200);
      const { name, price, category } = res.body.data;
      expect(name).toBe('test-name2');
      expect(price).toBe('2222');
      expect(category).toBe('test-category2');
    });

    it('Should get list of products', async () => {
      const res = await request
        .get('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toEqual(3);
    });

    it('Should get product Info', async () => {
      const res = await request
        .get(`/api/products/${product.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('test-name-product');
    });

    it('Should Update Product Info', async () => {
      const res = await request
        .put(`/api/products/${product.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...product,
          name: 'Yousef_Aboalata',
        });
      expect(res.status).toBe(200);
      const { id, name } = res.body.data;
      expect(id).toBe(product.id);
      expect(name).toBe('Yousef_Aboalata');
    });

    it('Should Delete Product', async () => {
      const res = await request
        .delete(`/api/products/${product.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(product.id);
      expect(res.body.data.name).toBe('Yousef_Aboalata');
    });
  });
});
