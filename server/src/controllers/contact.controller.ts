import { Request, Response } from 'express';
import { Inquiry } from '../models/inquiry.model';
import { emailService } from '../services/email.service';
import asyncHandler from 'express-async-handler';
import { logger } from '../config/logger';

class ContactController {
  
  // @desc    Submit a new contact inquiry
  // @route   POST /api/contact
  // @access  Public
  submitInquiry = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, subject, message } = req.body;

    // Validation
    if (!fullName || !email || !subject || !message) {
      res.status(400);
      throw new Error('All fields (fullName, email, subject, message) are required');
    }

    const emailRegex = /^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    // Save to database
    const inquiry = await Inquiry.create({
      fullName,
      email,
      subject,
      message,
      status: 'new'
    });

    // Send emails asynchronously
    try {
      await emailService.sendAdminInquiryNotification(inquiry);
      await emailService.sendCustomerAutoReply(inquiry);
    } catch (error) {
      logger.error('Failed to send inquiry emails, but inquiry was saved to DB', error);
      // We don't fail the request if emails fail, since the inquiry is safely in the DB.
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        id: inquiry._id,
        status: inquiry.status
      }
    });
  });

  // @desc    Get all inquiries
  // @route   GET /api/contact
  // @access  Private/Admin
  getInquiries = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query = { status };
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  });

  // @desc    Update inquiry status
  // @route   PUT /api/contact/:id/status
  // @access  Private/Admin
  updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be new, read, or replied.');
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      data: inquiry
    });
  });

  // @desc    Delete inquiry
  // @route   DELETE /api/contact/:id
  // @access  Private/Admin
  deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  });
}

export const contactController = new ContactController();
