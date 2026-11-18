import test from 'node:test';
import assert from 'node:assert/strict';
import UserModel, { validateEmail, formatRole } from './userService.js';

test('Task: Default export can be imported with custom name', () => {
  assert.equal(typeof UserModel, 'object');
  assert.equal(UserModel.name, 'Tanvir Ahmed');
  assert.equal(UserModel.role, 'admin');
});

test('Task: Named exports require exact names', () => {
  assert.equal(validateEmail('test@example.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(formatRole('admin'), 'ADMIN');
});
