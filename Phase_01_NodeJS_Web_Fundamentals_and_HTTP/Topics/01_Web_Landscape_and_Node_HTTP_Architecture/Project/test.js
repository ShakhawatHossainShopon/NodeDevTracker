import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sendJsonResponse,
  parseRequestUrl,
  HttpDispatcher
} from './index.js';

// Mock ServerResponse helper
function createMockResponse() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    getHeader(key) {
      return this.headers[key.toLowerCase()];
    },
    end(chunk) {
      this.body = chunk;
    }
  };
}

test('Task 1: sendJsonResponse sets status, content-type header and serializes payload', () => {
  const res = createMockResponse();
  const payload = { success: true, count: 42 };

  sendJsonResponse(res, 201, payload);

  assert.equal(res.statusCode, 201);
  assert.equal(res.getHeader('content-type'), 'application/json');
  assert.equal(typeof res.body, 'string');
  assert.deepEqual(JSON.parse(res.body), payload);
});

test('Task 2: parseRequestUrl extracts pathname and query parameters', () => {
  const parsed1 = parseRequestUrl('/api/items?sort=asc&limit=25');
  assert.equal(parsed1.pathname, '/api/items');
  assert.deepEqual(parsed1.query, { sort: 'asc', limit: '25' });

  const parsed2 = parseRequestUrl('/health');
  assert.equal(parsed2.pathname, '/health');
  assert.deepEqual(parsed2.query, {});
});

test('Task 3: HttpDispatcher routes GET/POST requests and handles 404 fallback', () => {
  const dispatcher = new HttpDispatcher();
  let getHandled = false;
  let postHandled = false;

  dispatcher.get('/api/users', (req, res) => {
    getHandled = true;
    sendJsonResponse(res, 200, { users: [], query: req.query });
  });

  dispatcher.post('/api/users', (req, res) => {
    postHandled = true;
    sendJsonResponse(res, 201, { created: true });
  });

  // Test GET match
  const reqGet = { method: 'GET', url: '/api/users?role=editor' };
  const resGet = createMockResponse();
  dispatcher.dispatch(reqGet, resGet);
  assert.equal(getHandled, true);
  assert.equal(resGet.statusCode, 200);
  assert.deepEqual(JSON.parse(resGet.body).query, { role: 'editor' });

  // Test POST match
  const reqPost = { method: 'POST', url: '/api/users' };
  const resPost = createMockResponse();
  dispatcher.dispatch(reqPost, resPost);
  assert.equal(postHandled, true);
  assert.equal(resPost.statusCode, 201);

  // Test 404 Fallback
  const req404 = { method: 'GET', url: '/api/unknown' };
  const res404 = createMockResponse();
  dispatcher.dispatch(req404, res404);
  assert.equal(res404.statusCode, 404);
  assert.deepEqual(JSON.parse(res404.body), { status: 'fail', message: 'Route not found' });
});
