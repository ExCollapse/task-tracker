const request = require('supertest');

jest.mock('../src/db', () => ({ query: jest.fn() }));

const pool = require('../src/db');
const app = require('../src/app');

const sampleTask = {
  id: 1,
  title: 'Write report',
  description: null,
  priority: 'medium',
  due_date: null,
  completed: false,
};

beforeEach(() => {
  pool.query.mockReset();
});

describe('GET /api/health', () => {
  test('returns ok when the database responds', async () => {
    pool.query.mockResolvedValue({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('returns 500 when the database is down', async () => {
    pool.query.mockRejectedValue(new Error('connection refused'));
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(500);
  });
});

describe('GET /api/tasks', () => {
  test('returns the list of tasks', async () => {
    pool.query.mockResolvedValue({ rows: [sampleTask] });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('passes the completed filter to the query', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await request(app).get('/api/tasks?completed=true');
    expect(pool.query.mock.calls[0][1]).toEqual([true]);
  });

  test('rejects an invalid priority filter', async () => {
    const res = await request(app).get('/api/tasks?priority=urgent');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/tasks/:id', () => {
  test('returns a task', async () => {
    pool.query.mockResolvedValue({ rows: [sampleTask] });
    const res = await request(app).get('/api/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Write report');
  });

  test('returns 404 when the task does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/tasks/99');
    expect(res.status).toBe(404);
  });

  test('returns 400 for a non-numeric id', async () => {
    const res = await request(app).get('/api/tasks/abc');
    expect(res.status).toBe(400);
  });
});

describe('POST /api/tasks', () => {
  test('creates a task', async () => {
    pool.query.mockResolvedValue({ rows: [sampleTask] });
    const res = await request(app).post('/api/tasks').send({ title: 'Write report' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  test('trims the title before saving', async () => {
    pool.query.mockResolvedValue({ rows: [sampleTask] });
    await request(app).post('/api/tasks').send({ title: '  Write report  ' });
    expect(pool.query.mock.calls[0][1][0]).toBe('Write report');
  });

  test('returns 400 when the title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ priority: 'low' });
    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('returns 400 for invalid JSON', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Content-Type', 'application/json')
      .send('{bad json');
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  test('updates a task', async () => {
    pool.query.mockResolvedValue({ rows: [{ ...sampleTask, title: 'New title' }] });
    const res = await request(app).put('/api/tasks/1').send({ title: 'New title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
  });

  test('returns 404 when the task does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const res = await request(app).put('/api/tasks/99').send({ title: 'Test' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/tasks/:id/toggle', () => {
  test('toggles the completed flag', async () => {
    pool.query.mockResolvedValue({ rows: [{ ...sampleTask, completed: true }] });
    const res = await request(app).patch('/api/tasks/1/toggle');
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });
});

describe('DELETE /api/tasks/:id', () => {
  test('deletes a task', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });
    const res = await request(app).delete('/api/tasks/1');
    expect(res.status).toBe(204);
  });

  test('returns 404 when the task does not exist', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });
    const res = await request(app).delete('/api/tasks/99');
    expect(res.status).toBe(404);
  });
});

describe('unknown routes', () => {
  test('returns 404', async () => {
    const res = await request(app).get('/api/nothing');
    expect(res.status).toBe(404);
  });
});
