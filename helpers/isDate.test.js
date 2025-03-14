const { isDate } = require('../helpers/isDate');
const moment = require('moment');

describe('isDate Helper Function', () => {
  it('should return false if value is undefined', () => {
    const result = isDate(undefined);
    expect(result).toBe(false);
  });

  it('should return false if value is null', () => {
    const result = isDate(null);
    expect(result).toBe(false);
  });

  it('should return false if value is an empty string', () => {
    const result = isDate('');
    expect(result).toBe(false);
  });

  it('should return false if value is an invalid date', () => {
    const result = isDate('invalid-date');
    expect(result).toBe(false);
  });

  it('should return true if value is a valid date', () => {
    const result = isDate(moment().toISOString());
    expect(result).toBe(true);
  });

  it('should return true if value is a valid date string', () => {
    const result = isDate('2025-03-14T10:00:00Z');
    expect(result).toBe(true);
  });
});