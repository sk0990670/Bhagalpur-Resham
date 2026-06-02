import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { COOKIE_NAMES } from '../utils/constants';
import { env } from '../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and authorization
 */
class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register a new customer account
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name: { type: string, example: Priya Sharma }
   *               email: { type: string, example: priya@example.com }
   *               password: { type: string, example: Secure@123 }
   *               phone: { type: string, example: '+919876543210' }
   *     responses:
   *       201:
   *         description: Account created successfully
   *       409:
   *         description: Email already registered
   *       422:
   *         description: Validation error
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json(
      ApiResponse.created('Account created successfully', {
        user: result.user,
        accessToken: result.tokens.accessToken,
      }),
    );
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login with email and password
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json(
      ApiResponse.ok('Login successful', {
        user: result.user,
        accessToken: result.tokens.accessToken,
      }),
    );
  });

  /**
   * @swagger
   * /auth/google:
   *   post:
   *     tags: [Auth]
   *     summary: Login with Google
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [credential]
   *             properties:
   *               credential: { type: string }
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid Google token
   */
  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.loginWithGoogle(req.body);
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    res.json(
      ApiResponse.ok('Google login successful', {
        user: result.user,
        accessToken: result.tokens.accessToken,
      }),
    );
  });

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Logout current session
   *     responses:
   *       200:
   *         description: Logged out successfully
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;

    if (refreshToken && req.user) {
      await authService.logout(req.user.userId, refreshToken);
    }

    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
    res.json(ApiResponse.ok('Logged out successfully'));
  });

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     tags: [Auth]
   *     summary: Issue a new access token using a valid refresh token
   *     security: []
   *     responses:
   *       200:
   *         description: Tokens refreshed
   *       401:
   *         description: Invalid refresh token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;

    const result = await authService.refreshTokens(refreshToken);

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json(
      ApiResponse.ok('Tokens refreshed successfully', {
        accessToken: result.tokens.accessToken,
      }),
    );
  });

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     tags: [Auth]
   *     summary: Send a password reset email
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email]
   *             properties:
   *               email: { type: string }
   *     responses:
   *       200:
   *         description: Reset email sent (always 200 to prevent enumeration)
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    res.json(
      ApiResponse.ok('If that email is registered, you will receive a reset link shortly'),
    );
  });

  /**
   * @swagger
   * /auth/reset-password/{token}:
   *   post:
   *     tags: [Auth]
   *     summary: Reset password using a valid reset token
   *     security: []
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [password, confirmPassword]
   *             properties:
   *               password: { type: string }
   *               confirmPassword: { type: string }
   *     responses:
   *       200:
   *         description: Password reset successful
   *       400:
   *         description: Invalid or expired token
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.params.token as string, req.body.password);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
    res.json(ApiResponse.ok('Password reset successfully. Please log in with your new password.'));
  });

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Get current authenticated user
   *     responses:
   *       200:
   *         description: Current user profile
   *       401:
   *         description: Not authenticated
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.userId);
    res.json(ApiResponse.ok('User fetched successfully', user));
  });
}

export const authController = new AuthController();
