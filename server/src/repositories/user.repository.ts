import { BaseRepository } from './base.repository';
import { User, IUser } from '../models/user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() { super(User); }

  async findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  async findAllUsers(filter: Record<string, unknown>, pagination: any, sort: any) {
    return this.findAll({ filter, pagination, sort, select: '-password -refreshTokens -passwordResetToken -passwordResetExpires' });
  }

  async addAddress(userId: string, address: object) {
    return User.findByIdAndUpdate(userId, { $push: { addresses: address } }, { new: true }).exec();
  }

  async removeAddress(userId: string, addressId: string) {
    return User.findByIdAndUpdate(userId, { $pull: { addresses: { _id: addressId } } }, { new: true }).exec();
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await User.findByIdAndUpdate(userId, { $set: { 'addresses.$[].isDefault': false } }).exec();
    return User.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: { 'addresses.$.isDefault': true } },
      { new: true }
    ).exec();
  }

  async updateAvatar(userId: string, avatar: string) {
    return User.findByIdAndUpdate(userId, { avatar }, { new: true }).exec();
  }

  async deactivate(userId: string) {
    return User.findByIdAndUpdate(userId, { isActive: false }, { new: true }).exec();
  }

  async activate(userId: string) {
    return User.findByIdAndUpdate(userId, { isActive: true }, { new: true }).exec();
  }

  async updateRole(userId: string, role: string) {
    return User.findByIdAndUpdate(userId, { role }, { new: true }).exec();
  }
}

export const userRepository = new UserRepository();
