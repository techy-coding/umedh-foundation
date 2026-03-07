import { describe, it, expect } from 'vitest';
import { getDashboardPath } from '../lib/role-dashboard';

describe('getDashboardPath', () => {
  it('returns correct path for admin', () => {
    expect(getDashboardPath('admin')).toBe('/admin');
  });
  it('returns donor dashboard for donor', () => {
    expect(getDashboardPath('donor')).toBe('/donor/dashboard');
  });
  it('returns volunteer dashboard for volunteer', () => {
    expect(getDashboardPath('volunteer')).toBe('/volunteer/dashboard');
  });
  it('returns beneficiary dashboard for beneficiary', () => {
    expect(getDashboardPath('beneficiary')).toBe('/beneficiary/dashboard');
  });
  it('defaults to root for unknown roles', () => {
    expect(getDashboardPath('foo')).toBe('/');
    expect(getDashboardPath(null)).toBe('/');
  });
});
