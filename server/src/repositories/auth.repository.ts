import { User, IUser } from '../models/user.model';

/**
 * Base auth repository — handles all DB operations for User model
 * scoped to authentication flows.
 */
export class AuthRepository {
  /**
   * Find a user by email, optionally including password field
   */
  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  /**
   * Find a user by ID, optionally including sensitive fields
   */
  async findById(
    id: string,
    includeRefreshTokens = false,
  ): Promise<IUser | null> {
    const query = User.findById(id);
    if (includeRefreshTokens) {
      query.select('+refreshTokens');
    }
    return query.exec();
  }

  /**
   * Create a new user
   */
  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  /**
   * Update a user document
   */
  async update(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
  ): Promise<IUser | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return User.findOneAndUpdate(filter as any, update as any, { new: true }).exec();
  }

  /**
   * Push a refresh token to the user's token list
   */
  async addRefreshToken(userId: string, token: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $push: { refreshTokens: token },
    });
  }

  /**
   * Remove a specific refresh token (logout)
   */
  async removeRefreshToken(userId: string, token: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
  }

  /**
   * Remove all refresh tokens (logout all devices)
   */
  async clearRefreshTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
  }

  /**
   * Check whether a refresh token exists for a user
   */
  async hasRefreshToken(userId: string, token: string): Promise<boolean> {
    const user = await User.findById(userId).select('+refreshTokens').exec();
    return user?.refreshTokens?.includes(token) ?? false;
  }

  /**
   * Find user by password reset token
   */
  async findByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    })
      .select('+passwordResetToken +passwordResetExpires')
      .exec();
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }
}

export const authRepository = new AuthRepository();
