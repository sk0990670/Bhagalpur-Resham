import { artisanRepository } from '../models/artisan.model';
import { Order } from '../models/order.model';
import { assignmentRepository } from '../models/assignment.model';
import { ApiError } from '../utils/ApiError';
import mongoose from 'mongoose';

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
    if (sort === 'highest_rated') sortOption = { qualityRating: -1 };
    if (sort === 'lowest_workload') sortOption = { activeOrders: 1 };
    if (sort === 'fastest') sortOption = { averageCompletionTime: 1 };
    if (sort === 'most_experienced') sortOption = { experienceYears: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [artisans, total] = await Promise.all([
      artisanRepository.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
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
    const artisan = await artisanRepository.findById(id);
    if (!artisan) throw ApiError.notFound('Artisan not found');

    // Get active assignments
    const activeAssignments = await assignmentRepository.find({
      artisanId: id,
      status: { $in: ['pending', 'in_progress', 'delayed'] }
    }).populate('orderId').sort({ createdAt: -1 });

    // Get recently completed
    const completedAssignments = await assignmentRepository.find({
      artisanId: id,
      status: 'completed'
    }).sort({ updatedAt: -1 }).limit(10).populate('orderId');

    return { artisan, activeAssignments, completedAssignments };
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
    const artisan = await artisanRepository.create(data);
    return artisan;
  }

  async updateArtisan(id: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    const artisan = await artisanRepository.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!artisan) throw ApiError.notFound('Artisan not found');
    return artisan;
  }

  async deleteArtisan(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest('Invalid artisan ID');
    }
    const artisan = await artisanRepository.findByIdAndDelete(id);
    if (!artisan) throw ApiError.notFound('Artisan not found');
    return artisan;
  }

  async getDashboardStats() {
    const totalArtisans = await artisanRepository.countDocuments();
    const activeArtisans = await artisanRepository.countDocuments({ status: 'busy' });
    const productsInProduction = await Order.countDocuments({ status: 'in_production' });
    
    // Aggregate stats
    const avgStats = await artisanRepository.aggregate([
      {
        $group: {
          _id: null,
          avgCompletionTime: { $avg: '$averageCompletionTime' },
          totalEarnings: { $sum: '$earnings' }
        }
      }
    ]);

    const delayedProductions = await Order.countDocuments({
      status: 'in_production',
      estimatedDelivery: { $lt: new Date() }
    });

    return {
      totalArtisans,
      activeArtisans,
      productsInProduction,
      averageCompletionTime: avgStats[0]?.avgCompletionTime || 0,
      totalPayoutsThisMonth: avgStats[0]?.totalEarnings || 0, // Simplified for now
      delayedProductions
    };
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
