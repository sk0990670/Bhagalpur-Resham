import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

class UserController {
  /** GET /users/profile */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.userId);
    res.json(ApiResponse.ok('Profile fetched', user));
  });

  /** PATCH /users/profile */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    res.json(ApiResponse.ok('Profile updated', user));
  });

  /** PATCH /users/change-password */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json(ApiResponse.ok(result.message));
  });

  /** POST /users/addresses */
  addAddress = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.addAddress(req.user!.userId, req.body.address);
    res.status(201).json(ApiResponse.created('Address added', user));
  });

  /** DELETE /users/addresses/:addressId */
  removeAddress = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.removeAddress(req.user!.userId, req.params.addressId as string);
    res.json(ApiResponse.ok('Address removed', user));
  });

  /** PATCH /users/addresses/:addressId/default */
  setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.setDefaultAddress(req.user!.userId, req.params.addressId as string);
    res.json(ApiResponse.ok('Default address set', user));
  });

  // Admin
  /** GET /admin/users */
  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.listUsers(req);
    res.json(ApiResponse.ok('Users fetched', result.data, result.meta));
  });

  /** GET /admin/users/:id */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id as string);
    res.json(ApiResponse.ok('User fetched', user));
  });

  /** POST /admin/users */
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(ApiResponse.created('User created successfully', user));
  });

  /** PATCH /admin/users/:id/role */
  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateRole(req.params.id as string, req.body.role);
    res.json(ApiResponse.ok('Role updated', user));
  });

  /** PATCH /admin/users/:id/deactivate */
  deactivateUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.deactivateUser(req.params.id as string);
    res.json(ApiResponse.ok('User deactivated'));
  });

  /** PATCH /admin/users/:id/activate */
  activateUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.activateUser(req.params.id as string);
    res.json(ApiResponse.ok('User activated'));
  });
}
export const userController = new UserController();
