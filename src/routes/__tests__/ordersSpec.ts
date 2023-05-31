import supertest from 'supertest';
import db from '../../database';
import UserModel from '../../models/user.model';
import ProductModel from '../../models/product.model';
import OrderModel from '../../models/order.model';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import Order from '../../types/order.type';
import app from '../../index';
import jwt from 'jsonwebtoken';
import config from '../../config';
import OrderProduct from '../../types/order_product.type';

const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const request = supertest(app);
let token: string;

describe('Order API Endpoints', () => {
  const product = {
    name: 'test-name',
    price: '222',
    category: 'test-category',
  } as Product;

  const user = {
    username: 'test-user-name-order',
    first_name: 'test-first-name-order',
    last_name: 'test-last-name-order',
    password_digest: 'test123',
  } as User;

  const order = {
    user_id: 4,
    status: 'active',
  } as Order;

  beforeAll(async () => {
    const createdUser = await userModel.create(user);
    user.id = createdUser.id;
    const createdProduct = await productModel.create(product);
    product.id = createdProduct.id;
    const createdOrder = await orderModel.create(order);
    order.id = createdOrder.id;
    const userThree = {
      username: 'ordertester',
      first_name: 'OrderTest',
      last_name: 'cscTester',
      password_digest: 'passssword123',
    };
    const response = await request.post('/api/users').send(userThree);
    token = response.body.data.token;
  });

  afterAll(async () => {
    const conn = await db.connect();
    const fsql = 'DELETE FROM orders;';
    await conn.query(fsql);
    const lsql = 'DELETE FROM order_products;';
    await conn.query(lsql);
    conn.release();
  });

  describe('Test CRUD API methods', () => {
    it('Should Create a new order', async () => {
      const res = await request
        .post('/api/orders/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(order);
      expect(res.status).toBe(200);
      const { user_id, status, id } = res.body.data;
      order.id = id;
      expect(user_id).toBe(4);
      expect(status).toBe('active');
    });

    it('Should get list of orders', async () => {
      const res = await request
        .get('/api/orders')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toEqual(2);
    });

    it('Should get Order Info', async () => {
      const res = await request
        .get(`/api/orders/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('active');
    });

    it('Should Update order Info', async () => {
      const res = await request
        .put(`/api/orders/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...order,
          status: 'complete',
        });
      expect(res.status).toBe(200);
      const { id, status } = res.body.data;
      expect(id).toBe(order.id);
      expect(status).toBe('complete');
    });

    it('Should delete Order', async () => {
      const res = await request
        .delete(`/api/orders/${order.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(order.id);
      expect(res.body.data.status).toBe('complete');
    });

    it('Should Get Current Orders', async () => {
      const res = await request
        .get(`/api/orders/current-orders/${order.user_id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(1);
    });

    it('Should Add Product To Order', async () => {
      const res = await request
        .put(`/api/orders/add-product-to-order/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product_id: 4,
          order_id: 7,
          quantity: 20,
        } as OrderProduct);
      expect(res.status).toBe(200);
    });
  });
});
