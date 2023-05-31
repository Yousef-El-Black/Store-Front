import supertest from 'supertest';
import db from '../../database';
import UserModel from '../../models/user.model';
import User from '../../types/user.type';
import app from '../../index';
import jwt from 'jsonwebtoken';
import config from '../../config';

const userModel = new UserModel();
const request = supertest(app);

describe('User API Endpoints', () => {
  const user = {
    username: 'test-user-name',
    first_name: 'test-first-name',
    last_name: 'test-last-name',
    password_digest: 'test123',
  } as User;

  let token = jwt.sign(
    { username: user.username },
    config.tokenSecret as unknown as string
  );

  beforeAll(async () => {
    const createdUser = await userModel.create(user);
    user.id = createdUser.id;
  });

  afterAll(async () => {
    const conn = await db.connect();
    const sql = 'DELETE FROM users;';
    await conn.query(sql);
    conn.release();
  });

  describe('Test CRUD API methods', () => {
    it('should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'test2-user-name',
          first_name: 'test2-first-name',
          last_name: 'test2-last-name',
          password_digest: 'test2123',
        } as User);
      expect(res.status).toBe(200);
      const { username, first_name, last_name } = res.body.data;
      expect(username).toBe('test2-user-name');
      expect(first_name).toBe('test2-first-name');
      expect(last_name).toBe('test2-last-name');
    });

    it('should get list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Object.keys(res.body.data).length).toBe(5);
    });

    it('Should get user Info', async () => {
      const res = await request
        .get(`/api/users/${user.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe('test-user-name');
    });

    it('Should update user Info', async () => {
      const res = await request
        .put(`/api/users/${user.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          username: 'Yousef_Aboalata',
          first_name: 'Yousef',
          last_name: 'Aboalata',
        });
      expect(res.status).toBe(200);
      const { id, username, first_name, last_name } = res.body.data;
      expect(id).toBe(user.id);
      expect(username).toBe('Yousef_Aboalata');
      expect(first_name).toBe('Yousef');
      expect(last_name).toBe('Aboalata');
    });

    it('Should Delete User', async () => {
      const res = await request
        .delete(`/api/users/${user.id}/`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.username).toBe('Yousef_Aboalata');
    });
  });
});
