import { artisanRepository } from '../models/artisan.model';
import { Order } from '../models/order.model';
import { assignmentRepository } from '../models/assignment.model';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';
import { valkeyClient } from '../config/valkey';
import { cloudinary } from '../config/cloudinary';

export class ArtisanService {
  async getAllArtisans(query: any) {
    const { search, status, sort, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { artisanId: { $regex: search, $options: 'i' } },
        { 'specialization': { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      filter.status = status;
    }

    let sortOption: any = { createdAt: -1 };
    // We cannot sort by dynamically computed qualityRating or averageCompletionTime easily right now, 
    // but we can sort by activeOrders which we compute in the pipeline.
    if (sort === 'lowest_workload') sortOption = { activeOrders: 1 };
    if (sort === 'fastest') sortOption = { experienceYears: -1 }; // fallback since averageTime is removed
    if (sort === 'most_experienced') sortOption = { experienceYears: -1 };
    if (sort === 'highest_rated') sortOption = { experienceYears: -1 }; // fallback

    const skip = (Number(page) - 1) * Number(limit);

    const pipeline: any[] = [
      { $match: filter },
      // Lookup active orders directly from orders collection
      {
        $lookup: {
          from: 'orders',
          let: { artisanId: '$_id' },
          pipeline: [
            { 
              $match: {
                $expr: { $eq: ['$assignedArtisan', '$$artisanId'] },
                status: { $in: ['in_production', 'ready_for_shipping'] }
              }
            }
          ],
          as: 'activeOrdersList'
        }
      },
      // Lookup assignments for completed count and earnings
      {
        $lookup: {
          from: 'productionassignments',
          localField: '_id',
          foreignField: 'artisanId',
          as: 'allAssignments'
        }
      },
      // Add dynamic fields
      {
        $addFields: {
          activeOrders: { $size: '$activeOrdersList' },
          completedOrders: {
            $size: {
              $filter: {
                input: '$allAssignments',
                as: 'assignment',
                cond: { $eq: ['$$assignment.status', 'completed'] }
              }
            }
          },
          earnings: { $sum: '$allAssignments.amountPaid' }
        }
      },
      // Clean up lists
      { $project: { activeOrdersList: 0, allAssignments: 0 } },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: Number(limit) }
    ];

    const [artisans, total] = await Promise.all([
      artisanRepository.aggregate(pipeline),
      artisanRepository.countDocuments(filter)
    ]);

    return {
      artisans,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getArtisanById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    
    const pipeline: any[] = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'orders',
          let: { artisanId: '$_id' },
          pipeline: [
            { 
              $match: {
                $expr: { $eq: ['$assignedArtisan', '$$artisanId'] },
                status: { $in: ['in_production', 'ready_for_shipping'] }
              }
            }
          ],
          as: 'activeOrdersList'
        }
      },
      {
        $lookup: {
          from: 'productionassignments',
          localField: '_id',
          foreignField: 'artisanId',
          as: 'allAssignments'
        }
      },
      {
        $addFields: {
          activeOrders: { $size: '$activeOrdersList' },
          completedOrders: {
            $size: {
              $filter: {
                input: '$allAssignments',
                as: 'assignment',
                cond: { $eq: ['$$assignment.status', 'completed'] }
              }
            }
          },
          earnings: { $sum: '$allAssignments.amountPaid' }
        }
      },
      { $project: { activeOrdersList: 0, allAssignments: 0 } }
    ];

    const artisanResult = await artisanRepository.aggregate(pipeline);
    if (!artisanResult || artisanResult.length === 0) throw ApiError.notFound('Artisan not found');
    
    const artisan = artisanResult[0];

    // Get active assignments
    const activeAssignments = await assignmentRepository.find({
      artisanId: id,
      status: { $in: ['pending', 'in_progress', 'delayed'] }
    }).populate('orderId').sort({ createdAt: -1 });

    // Get recently completed
    const completedAssignments = await assignmentRepository.find({
      artisanId: id,
      status: 'completed'
    }).sort({ updatedAt: -1 }).populate('orderId');

    // Get all assignments for history
    const allAssignments = await assignmentRepository.find({
      artisanId: id
    }).populate('orderId').sort({ createdAt: -1 });

    return { artisan, activeAssignments, completedAssignments, allAssignments };
  }

  async getArtisanOrders(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    const assignments = await assignmentRepository.find({ artisanId: id })
      .populate('orderId')
      .sort({ createdAt: -1 });
    return assignments;
  }

  async createArtisan(data: any) {
    // Generate artisanId if not provided
    if (!data.artisanId) {
      const count = await artisanRepository.countDocuments();
      data.artisanId = `ART-${String(count + 1).padStart(3, '0')}`;
    }

    if (data.tempId) {
      const imageDataStr = await valkeyClient.get(`temp_image:${data.tempId}`);
      if (imageDataStr) {
        const { data: imgData } = JSON.parse(imageDataStr);
        const buffer = Buffer.from(imgData, 'base64');
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'bhagalpur-resham/artisans',
              public_id: data.artisanId,
              overwrite: true,
              invalidate: true,
              resource_type: 'image',
              format: 'webp'
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        data.image = result.secure_url;
        await valkeyClient.del(`temp_image:${data.tempId}`);
      }
    }

    const artisan = await artisanRepository.create(data);
    return artisan;
  }

  async updateArtisan(id: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    const artisanDoc = await artisanRepository.findById(id);
    if (!artisanDoc) throw ApiError.notFound('Artisan not found');

    if (data.tempId) {
      console.log(`Processing tempId: ${data.tempId}`);
      const imageDataStr = await valkeyClient.get(`temp_image:${data.tempId}`);
      if (imageDataStr) {
        console.log(`Found image data for tempId: ${data.tempId}`);
        const { data: imgData } = JSON.parse(imageDataStr);
        const buffer = Buffer.from(imgData, 'base64');
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'bhagalpur-resham/artisans',
              public_id: artisanDoc.artisanId,
              overwrite: true,
              invalidate: true,
              resource_type: 'image',
              format: 'webp'
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(error);
              }
              resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        console.log('Cloudinary result URL:', result.secure_url);
        data.image = result.secure_url;
        await valkeyClient.del(`temp_image:${data.tempId}`);
      } else {
        console.log(`No image data found in Valkey for tempId: ${data.tempId}`);
      }
    } else {
      console.log('No tempId provided in data', data);
    }

    const artisan = await artisanRepository.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return artisan;
  }

  async deleteArtisan(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    const artisan = await artisanRepository.findByIdAndDelete(id);
    if (!artisan) throw ApiError.notFound('Artisan not found');

    try {
      if (artisan.artisanId) {
        await cloudinary.uploader.destroy(`bhagalpur-resham/artisans/${artisan.artisanId}`);
      }
    } catch (error) {
      console.error(`Failed to delete Cloudinary image for artisan ${artisan.artisanId}:`, error);
    }

    return artisan;
  }

  async getDashboardStats() {
    const totalArtisans = await artisanRepository.countDocuments();
    
    // Count existing artisans who have at least 1 active order
    const activeArtisansResult = await Order.aggregate([
      { $match: { status: { $in: ['in_production', 'ready_for_shipping'] }, assignedArtisan: { $ne: null } } },
      { $group: { _id: '$assignedArtisan' } },
      { $lookup: { from: 'artisans', localField: '_id', foreignField: '_id', as: 'artisan' } },
      { $match: { 'artisan.0': { $exists: true } } },
      { $count: 'count' }
    ]);
    const activeArtisans = activeArtisansResult[0]?.count || 0;
    
    // Count products in production assigned to valid artisans
    const productsInProductionResult = await Order.aggregate([
      { $match: { status: 'in_production', assignedArtisan: { $ne: null } } },
      { $lookup: { from: 'artisans', localField: 'assignedArtisan', foreignField: '_id', as: 'artisan' } },
      { $match: { 'artisan.0': { $exists: true } } },
      { $count: 'count' }
    ]);
    const productsInProduction = productsInProductionResult[0]?.count || 0;
    
    // Aggregate stats from assignments for valid artisans
    const payoutStats = await assignmentRepository.aggregate([
      { $lookup: { from: 'artisans', localField: 'artisanId', foreignField: '_id', as: 'artisan' } },
      { $match: { 'artisan.0': { $exists: true } } },
      {
        $group: {
          _id: null,
          totalPayouts: { $sum: '$amountPaid' }
        }
      }
    ]);

    // Also filter delayed productions by valid artisans
    const delayedProductionsResult = await Order.aggregate([
      { $match: { status: 'in_production', estimatedDelivery: { $lt: new Date() }, assignedArtisan: { $ne: null } } },
      { $lookup: { from: 'artisans', localField: 'assignedArtisan', foreignField: '_id', as: 'artisan' } },
      { $match: { 'artisan.0': { $exists: true } } },
      { $count: 'count' }
    ]);
    const delayedProductions = delayedProductionsResult[0]?.count || 0;

    return {
      totalArtisans,
      activeArtisans,
      productsInProduction,
      averageCapacityUtilization: 0,
      totalPayoutsThisMonth: payoutStats[0]?.totalPayouts || 0,
      delayedProductions
    };
  }

  async updateAssignmentPayment(assignmentId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw ApiError.badRequest('Invalid assignment ID');
    }
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment) throw ApiError.notFound('Assignment not found');

    const artisanCharge = data.artisanCharge !== undefined ? Number(data.artisanCharge) : assignment.artisanCharge;
    const amountPaid = data.amountPaid !== undefined ? Number(data.amountPaid) : assignment.amountPaid;
    
    const remainingAmount = artisanCharge - amountPaid;
    const paymentCompleted = amountPaid >= artisanCharge && artisanCharge > 0;
    const paymentCompletedAt = paymentCompleted && !assignment.paymentCompleted ? new Date() : assignment.paymentCompletedAt;

    const updatedAssignment = await assignmentRepository.findByIdAndUpdate(
      assignmentId,
      {
        artisanCharge,
        amountPaid,
        remainingAmount,
        paymentCompleted,
        paymentCompletedAt
      },
      { new: true }
    );

    return updatedAssignment;
  }

  async getRecommendedArtisans(skill?: string) {
    // Find available artisans, sorted by workload and rating
    const query: any = { status: { $in: ['available', 'busy'] } };
    if (skill) {
      query.specialization = { $regex: skill, $options: 'i' };
    }
    return artisanRepository.find(query)
      .sort({ activeOrders: 1, qualityRating: -1 })
      .limit(5);
  }
}

export const artisanService = new ArtisanService();
