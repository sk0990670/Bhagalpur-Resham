import { Request, Response } from 'express';
import { artisanService } from '../services/artisan.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllArtisans = asyncHandler(async (req: Request, res: Response) => {
  const result = await artisanService.getAllArtisans(req.query);
  res.status(200).json({ success: true, data: result });
});

export const getArtisanById = asyncHandler(async (req: Request, res: Response) => {
  const result = await artisanService.getArtisanById(req.params.id as string);
  res.status(200).json({ success: true, data: result });
});

export const createArtisan = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanService.createArtisan(req.body);
  res.status(201).json({ success: true, data: artisan });
});

export const updateArtisan = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanService.updateArtisan(req.params.id as string, req.body);
  res.status(200).json({ success: true, data: artisan });
});

export const deleteArtisan = asyncHandler(async (req: Request, res: Response) => {
  await artisanService.deleteArtisan(req.params.id as string);
  res.status(200).json({ success: true, message: 'Artisan deleted successfully' });
});

export const getArtisanOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await artisanService.getArtisanOrders(req.params.id as string);
  res.status(200).json({ success: true, data: orders });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await artisanService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

export const getRecommendedArtisans = asyncHandler(async (req: Request, res: Response) => {
  const skill = req.query.skill as string;
  const artisans = await artisanService.getRecommendedArtisans(skill);
  res.status(200).json({ success: true, data: artisans });
});

export const updateAssignmentPayment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await artisanService.updateAssignmentPayment(req.params.assignmentId as string, req.body);
  res.status(200).json({ success: true, data: assignment });
});
