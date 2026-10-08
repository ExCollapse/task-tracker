const PRIORITIES = ['low', 'medium', 'high'];

function validateTask(body) {
  const errors = [];
  const { title, description, priority, due_date } = body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required');
  } else if (title.trim().length > 200) {
    errors.push('title must be at most 200 characters');
  }

  if (description != null && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  if (priority != null && !PRIORITIES.includes(priority)) {
    errors.push('priority must be one of: low, medium, high');
  }

  if (due_date != null && due_date !== '') {
    const isFormatOk = /^\d{4}-\d{2}-\d{2}$/.test(due_date);
    if (!isFormatOk || isNaN(Date.parse(due_date))) {
      errors.push('due_date must be a valid date (YYYY-MM-DD)');
    }
  }

  return errors;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = { validateTask, parseId, PRIORITIES };
