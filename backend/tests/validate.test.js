const { validateTask, parseId } = require('../src/validate');

describe('validateTask', () => {
  test('accepts a valid task', () => {
    const errors = validateTask({ title: 'Buy milk', priority: 'high', due_date: '2026-12-01' });
    expect(errors).toHaveLength(0);
  });

  test('requires a title', () => {
    expect(validateTask({})).toContain('title is required');
    expect(validateTask({ title: '   ' })).toContain('title is required');
  });

  test('rejects a title longer than 200 characters', () => {
    const errors = validateTask({ title: 'a'.repeat(201) });
    expect(errors).toContain('title must be at most 200 characters');
  });

  test('rejects an unknown priority', () => {
    const errors = validateTask({ title: 'Test', priority: 'urgent' });
    expect(errors).toHaveLength(1);
  });

  test('rejects a wrong date format', () => {
    const errors = validateTask({ title: 'Test', due_date: '01.12.2026' });
    expect(errors).toHaveLength(1);
  });
});

describe('parseId', () => {
  test('returns a number for valid ids', () => {
    expect(parseId('5')).toBe(5);
  });

  test('returns null for invalid ids', () => {
    expect(parseId('abc')).toBeNull();
    expect(parseId('-1')).toBeNull();
    expect(parseId('1.5')).toBeNull();
  });
});
