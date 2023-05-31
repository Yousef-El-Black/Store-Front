import OrderModel from '../order.model';
import db from '../../database';
import Order from '../../types/order.type';
import User from '../../types/user.type';
import UserModel from '../user.model';
import Product from '../../types/product.type';
import ProductModel from '../product.model';
import OrderProduct from '../../types/order_product.type';

const userModel = new UserModel();
const orderModel = new OrderModel();
const productModel = new ProductModel();

describe('Order Model', () => {
  describe('Test Methods Exists', () => {
    it('Should have an Show All Orders Method', () => {
      expect(orderModel.index).toBeDefined();
    });

    it('Should have an Show One Order Method', () => {
      expect(orderModel.show).toBeDefined();
    });

    it('Should have an Create Order Method', () => {
      expect(orderModel.create).toBeDefined();
    });

    it('Should have an Update Order Method', () => {
      expect(orderModel.update).toBeDefined();
    });

    it('Should have an Delete Order Method', () => {
      expect(orderModel.delete).toBeDefined();
    });

    it('Should have an Get Current Orders Method', () => {
      expect(orderModel.getCurrentOrders).toBeDefined();
    });

    it('Should have an Add Product To Order Method', () => {
      expect(orderModel.addProductToOrder).toBeDefined();
    });
  });

  describe('Test Order Model Logic', () => {
    const order = {
      user_id: 1,
      status: 'new',
    } as Order;

    const product = {
      name: 'product-name',
      price: '30',
      category: 'books',
    } as Product;

    const productToOrder = {
      order_id: 2,
      product_id: 1,
      quantity: 10,
    } as OrderProduct;

    const user = {
      username: 'test-user-name',
      first_name: 'test-first-name',
      last_name: 'test-last-name',
      password_digest: 'test123',
    } as User;

    beforeAll(async () => {
      const createdUser = await userModel.create(user);
      user.id = createdUser.id;
      const createdOrder = await orderModel.create(order);
      order.id = createdOrder.id;
    });

    afterAll(async () => {
      const conn = await db.connect();
      const sqlOrders = 'DELETE FROM orders;';
      await conn.query(sqlOrders);
      const sqlOrdersProducts = 'DELETE FROM order_products;';
      await conn.query(sqlOrdersProducts);
      conn.release();
    });

    it('Create Method should return a New Order', async () => {
      const createdOrder = await orderModel.create({
        user_id: 1,
        status: 'new',
      } as Order);

      expect(createdOrder).toEqual({
        id: createdOrder.id,
        user_id: 1,
        status: 'new',
      } as Order);
    });

    it('Show All Method should return All Available Orders in DB', async () => {
      const orders = await orderModel.index();
      expect(orders.length).toEqual(2);
    });

    it('Show One Method should return One Order when called with Id', async () => {
      const returnedOrder = await orderModel.show(
        order.id as unknown as string
      );
      expect(returnedOrder.id).toBe(user.id);
      expect(returnedOrder.user_id).toBe(order.user_id);
      expect(returnedOrder.status).toBe(order.status);
    });

    it('Update One Method should return One Order when called with Id With Edited Info', async () => {
      const updatedOrder = await orderModel.update({
        ...order,
        status: 'test-status-updated',
      });
      expect(updatedOrder.id).toBe(order.id);
      expect(updatedOrder.user_id).toBe(1);
      expect(updatedOrder.status).toBe('test-status-updated');
    });

    it('Delete One Order Method should delete user from DB', async () => {
      const deletedOrder = await orderModel.delete(
        order.id as unknown as string
      );
      expect(deletedOrder.id).toBe(order.id);
    });

    it('Get Current Orders Method should get All Current Orders', async () => {
      const currentOrders = await orderModel.getCurrentOrders(
        order.user_id as unknown as string
      );
      expect(currentOrders.length).toEqual(1);
    });

    it('Add Product To Order Method should return Product To Order from DB', async () => {
      await productModel.create(product);
      const addedProductToOrder = await orderModel.addProductToOrder(
        productToOrder
      );
      expect(addedProductToOrder.id).toBe(1);
      expect(addedProductToOrder.order_id).toBe(2);
      expect(addedProductToOrder.product_id).toBe(1);
      expect(addedProductToOrder.quantity).toBe(10);
    });
  });
});
