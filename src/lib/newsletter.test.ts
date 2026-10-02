import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeNewsletterEmail, isValidNewsletterEmail } from './newsletter.ts';

test('normalizeNewsletterEmail trims and lowercases email addresses', () => {
  assert.equal(normalizeNewsletterEmail('  User.Name+tag@Example.com  '), 'user.name+tag@example.com');
});

test('isValidNewsletterEmail rejects malformed addresses', () => {
  assert.equal(isValidNewsletterEmail('hello@'), false);
  assert.equal(isValidNewsletterEmail('user@example.com'), true);
  assert.equal(isValidNewsletterEmail('user@localhost'), false);
});
