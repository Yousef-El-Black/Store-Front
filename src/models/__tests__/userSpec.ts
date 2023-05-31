import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('User Model', () => {
  describe('Test Methods Exists', () => {
    it('Should have an Show All Users Method', () => {
      expect(userModel.index).toBeDefined();
    });

    it('Should have an Show User Method', () => {
      expect(userModel.show).toBeDefined();
    });

    it('Should have an Create User Method', () => {
      expect(userModel.create).toBeDefined();
    });

    it('Should have an Update User Method', () => {
      expect(userModel.update).toBeDefined();
    });

    it('Should have an Delete User Method', () => {
      expect(userModel.delete).toBeDefined();
    });
  });

  describe('Test User Model Logic', () => {
    const user = {
      username: 'test-user-name',
      first_name: 'test-first-name',
      last_name: 'test-last-name',
      password_digest: 'test123',
    } as User;

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

    it('Create Method should return a New User', async () => {
      const createdUser = await userModel.create({
        username: 'test2-user-name',
        first_name: 'test2-first-name',
        last_name: 'test2-last-name',
        password_digest: 'test2123',
      } as User);

      expect(createdUser).toEqual({
        id: createdUser.id,
        username: 'test2-user-name',
        first_name: 'test2-first-name',
        last_name: 'test2-last-name',
      } as User);
    });

    it('Show All Method should return All Available Users in DB', async () => {
      const users = await userModel.index();
      expect(users.length).toEqual(3);
    });

    it('Show One Method should return One User when called with Id', async () => {
      const returnedUser = await userModel.show(user.id as unknown as string);
      expect(returnedUser.id).toBe(user.id);
      expect(returnedUser.username).toBe(user.username);
      expect(returnedUser.first_name).toBe(user.first_name);
      expect(returnedUser.last_name).toBe(user.last_name);
    });

    it('Update One Method should return One User when called with Id With Edited Info', async () => {
      const updatedUser = await userModel.update({
        ...user,
        username: 'test-user-name-updated',
        first_name: 'test-first-name-updated',
        last_name: 'test-last-name-updated',
      });
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.username).toBe('test-user-name-updated');
      expect(updatedUser.first_name).toBe('test-first-name-updated');
      expect(updatedUser.last_name).toBe('test-last-name-updated');
    });

    it('Delete One User Method should delete user from DB', async () => {
      const deletedUser = await userModel.delete(user.id as unknown as string);
      expect(deletedUser.id).toBe(user.id);
    });
  });
});
