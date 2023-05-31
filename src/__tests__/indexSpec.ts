import supertest from 'supertest';
import app from '../index';

// Create a Request Object
const request = supertest(app);

describe('Test basic endpoint server', () => {
  it('Get the / endpoint', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
  });
});
