import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { authRepository } from '../repositories/auth.repository';
import { ApiError } from '../utils/ApiError';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.utils';
import { ROLES } from '../utils/constants';
import { env } from '../config/env';
import { logger } from '../config/logger';
import type { RegisterInput, LoginInput } from '../validations/auth.validation';

// ── Email transporter ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: { user: env.smtp.user, pass: env.smtp.pass },
});

class AuthService {
  // ── Register ───────────────────────────────────────────────
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: ROLES.CUSTOMER,
    });

    const tokens = generateTokenPair({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    await authRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);

    logger.info(`New user registered: ${user.email}`);
    return { user: user.toSafeObject(), tokens };
  }

  // ── Login ──────────────────────────────────────────────────
  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email, true);

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Contact support.');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = generateTokenPair({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    await authRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);
    await authRepository.updateLastLogin(user._id.toString());

    logger.info(`User logged in: ${user.email}`);
    return { user: user.toSafeObject(), tokens };
  }

  // ── Logout ─────────────────────────────────────────────────
  async logout(userId: string, refreshToken: string): Promise<void> {
    await authRepository.removeRefreshToken(userId, refreshToken);
    logger.info(`User logged out: ${userId}`);
  }

  // ── Refresh Token ──────────────────────────────────────────
  async refreshTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const isValid = await authRepository.hasRefreshToken(payload.userId, refreshToken);
    if (!isValid) {
      throw ApiError.unauthorized('Refresh token is invalid or has been revoked');
    }

    // Rotate — remove old, issue new pair
    await authRepository.removeRefreshToken(payload.userId, refreshToken);

    const user = await authRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }

    const tokens = generateTokenPair({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    await authRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);
    return { tokens };
  }

  // ── Forgot Password ────────────────────────────────────────
  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);

    // Always respond with success to prevent email enumeration
    if (!user) {
      logger.warn(`Forgot password request for non-existent email: ${email}`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await authRepository.update(
      { _id: user._id },
      {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    );

    const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;

    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to: user.email,
        subject: 'Reset your Bhagalpur Resham password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b0000;">Reset Your Password</h2>
            <p>Hello ${user.name},</p>
            <p>You requested a password reset. Click the button below to set a new password. This link expires in 30 minutes.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#8b0000;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0;">
              Reset Password
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color:#666;font-size:12px;">— Bhagalpur Resham Team</p>
          </div>
        `,
      });
      logger.info(`Password reset email sent to ${user.email}`);
    } catch (err) {
      // Roll back token on email failure
      await authRepository.update(
        { _id: user._id },
        { $unset: { passwordResetToken: '', passwordResetExpires: '' } },
      );
      logger.error(`Failed to send reset email: ${(err as Error).message}`);
      throw ApiError.internal('Failed to send password reset email. Please try again.');
    }
  }

  // ── Reset Password ─────────────────────────────────────────
  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await authRepository.findByResetToken(hashedToken);
    if (!user) {
      throw ApiError.badRequest('Password reset token is invalid or has expired');
    }

    // Update password via save so pre-save hook rehashes it
    user.set('password', newPassword);
    user.set('passwordResetToken', undefined);
    user.set('passwordResetExpires', undefined);
    await user.save();

    // Invalidate all existing refresh tokens
    await authRepository.clearRefreshTokens(user._id.toString());

    logger.info(`Password reset successful for user: ${user.email}`);
  }

  // ── Get current user (from token) ─────────────────────────
  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user.toSafeObject();
  }
}

export const authService = new AuthService();
