import { z } from 'zod';
import { updateProfileSchema, changePasswordSchema } from '../src/validations/user.validation';

describe('User Validation Schemas', () => {
  describe('updateProfileSchema', () => {
    it('should pass with valid data', () => {
      const data = { name: 'Priya Sharma', phone: '9876543210' };
      const result = updateProfileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail with name too short', () => {
      const data = { name: 'P' };
      const result = updateProfileSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should pass with valid passwords', () => {
      const data = { currentPassword: 'OldPassword@123', newPassword: 'NewPassword@456' };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if new password is too simple', () => {
      const data = { currentPassword: 'OldPassword@123', newPassword: 'simple' };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
