import request from 'supertest';
import createApp from '../src/app';

const app = createApp();

describe('System Routes', () => {
  describe('GET /health', () => {
    it('should return 200 OK and status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('environment', 'test'); // test env
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
