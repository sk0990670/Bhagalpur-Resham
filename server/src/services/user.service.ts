import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { Request } from 'express';

class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId, '-password -refreshTokens -passwordResetToken -passwordResetExpires');
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateProfile(userId: string, data: Record<string, unknown>) {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId, '+password');
    if (!user) throw ApiError.notFound('User not found');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');
    user.set('password', newPassword);
    await user.save();
    return { message: 'Password changed successfully' };
  }

  async addAddress(userId: string, address: object) {
    return userRepository.addAddress(userId, address);
  }

  async removeAddress(userId: string, addressId: string) {
    return userRepository.removeAddress(userId, addressId);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    return userRepository.setDefaultAddress(userId, addressId);
  }

  // Admin methods
  async listUsers(req: Request) {
    const pagination = getPaginationOptions(req);
    const { search, role, isActive, sort } = req.query as any;
    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 },
    };
    const sortObj = sortMap[sort as string] ?? { createdAt: -1 };
    return userRepository.findAllUsers(filter, pagination, sortObj);
  }

  async getUserById(userId: string) {
    const user = await userRepository.findById(userId, '-password -refreshTokens');
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async createUser(data: Record<string, unknown>) {
    const existingUser = await userRepository.findByEmail(data.email as string);
    if (existingUser) throw ApiError.conflict('Email already exists');
    return userRepository.create(data);
  }

  async updateRole(userId: string, role: string) {
    return userRepository.updateRole(userId, role);
  }

  async deactivateUser(userId: string) {
    return userRepository.deactivate(userId);
  }

  async activateUser(userId: string) {
    return userRepository.activate(userId);
  }
}

export const userService = new UserService();
