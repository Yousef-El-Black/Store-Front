import db from '../database';
import Order from '../types/order.type';
import OrderProduct from '../types/order_product.type';

class OrderModel {
  // Show All Orders
  async index(): Promise<Order[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error at showing orders ${err as Error}.message`);
    }
  }

  // Show One Order By Id
  async show(id: string): Promise<Order> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Error at getting order: (${id}) ${err as Error}.message`
      );
    }
  }

  // Create Order
  async create(o: Order): Promise<Order> {
    try {
      const conn = await db.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id, user_id, status';
      const result = await conn.query(sql, [o.user_id, o.status]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Create (${o.id}): ${err as Error} Message`);
    }
  }

  // Update Order
  async update(o: Order): Promise<Order> {
    try {
      const conn = await db.connect();
      const sql =
        'UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING id, user_id, status';
      const result = await conn.query(sql, [o.user_id, o.status, o.id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Update (${o.id}): ${err as Error} Message`);
    }
  }
  // Delete  Order
  async delete(id: string): Promise<Order> {
    try {
      const conn = await db.connect();
      const sql =
        'DELETE FROM orders WHERE id=$1 RETURNING id, user_id, status';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to Delete (${id}): ${err as Error} Message`);
    }
  }

  // Get Current Orders
  async getCurrentOrders(id: string) {
    try {
      const conn = await db.connect();
      const sql = `SELECT * FROM orders WHERE user_id=($1);`;
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders for user ${id}. Error: ${err}`);
    }
  }

  async addProductToOrder(p: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await db.connect();
      const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;

      const result = await conn.query(sql, [
        p.order_id,
        p.product_id,
        p.quantity,
      ]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add product. Error: ${err}`);
    }
  }
}

export default OrderModel;
