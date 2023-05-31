// import { Client } from "pg";
import db from '../database';
import User from '../types/user.type';
import config from '../config';
import bcrypt from 'bcrypt';

const hashpassword_digest = (password_digest: string) => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password_digest}${config.pepper}`, salt);
};

class UserModel {
  // Create User
  async create(u: User): Promise<User> {
    try {
      // Open Connection With Database
      const conn = await db.connect();
      const sql =
        'INSERT INTO users (username, first_name, last_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING id, username, first_name, last_name';
      // Run Query To Create the User
      const result = await conn.query(sql, [
        u.username,
        u.first_name,
        u.last_name,
        hashpassword_digest(u.password_digest),
      ]);
      // Close Connection With Database
      conn.release();
      // Return The user
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Unable to Create (${u.username}): ${err as Error} Message`
      );
    }
  }
  // Get All Users
  async index(): Promise<User[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT id, username, first_name, last_name FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error at showing users ${err as Error}.message`);
    }
  }

  // Get One User By Id
  async show(id: string): Promise<User> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT id, username, first_name, last_name FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Error at getting user: (${id}) ${err as Error}.message`);
    }
  }

  // Update  User
  async update(u: User): Promise<User> {
    try {
      const conn = await db.connect();
      const sql =
        'UPDATE users SET username=$1, first_name=$2, last_name=$3, password_digest=$4 WHERE id=$5 RETURNING id, username, first_name, last_name';
      const result = await conn.query(sql, [
        u.username,
        u.first_name,
        u.last_name,
        hashpassword_digest(u.password_digest),
        u.id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error at updating the user:${u.id}`);
    }
  }

  // Delete User
  async delete(id: string): Promise<User> {
    try {
      const conn = await db.connect();
      const sql =
        'DELETE FROM users WHERE id=$1 RETURNING id, username, first_name, last_name';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error at Deleting user: (${id})`);
    }
  }

  // Authenticate User
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT password_digest FROM users WHERE username=($1);';
      const result = await conn.query(sql, [username]);
      if (result.rows.length) {
        const { password_digest: hashPassword } = result.rows[0];
        const isPasswordvalid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordvalid) {
          const userSql =
            'SELECT id, username, first_name, last_name FROM users WHERE username=($1);';
          const userInfo = await conn.query(userSql, [username]);
          return userInfo.rows[0];
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Error at Authenticate User: ${username}`);
    }
  }
}

export default UserModel;
