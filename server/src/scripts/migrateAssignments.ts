import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assignmentRepository } from '../models/assignment.model';
import { orderRepository } from '../repositories/order.repository';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagalpur-resham';

async function migrateAssignments() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const assignments = await assignmentRepository.find({});
    console.log(`Found ${assignments.length} assignments to migrate.`);

    let count = 0;
    for (const assignment of assignments) {
      let needsUpdate = false;
      const updateData: any = {};

      if (!assignment.assignmentId) {
        updateData.assignmentId = `ASN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        needsUpdate = true;
      }

      if (assignment.artisanCharge === undefined) {
        updateData.artisanCharge = 0;
        needsUpdate = true;
      }
      
      if (assignment.amountPaid === undefined) {
        updateData.amountPaid = 0;
        needsUpdate = true;
      }
      
      if (assignment.remainingAmount === undefined) {
        updateData.remainingAmount = (updateData.artisanCharge ?? assignment.artisanCharge) - (updateData.amountPaid ?? assignment.amountPaid);
        needsUpdate = true;
      }
      
      if (assignment.paymentCompleted === undefined) {
        updateData.paymentCompleted = false;
        needsUpdate = true;
      }

      // Sync currentStage from order
      if (!assignment.currentStage || assignment.currentStage === ('pending' as any)) {
        const order = await orderRepository.findById(assignment.orderId.toString());
        if (order && order.productionStage) {
          updateData.currentStage = order.productionStage;
          needsUpdate = true;
        } else {
          updateData.currentStage = 'assigned';
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await assignmentRepository.updateOne(
          { _id: assignment._id },
          { $set: updateData }
        );
        count++;
      }
    }

    console.log(`Migration complete. Updated ${count} assignments.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

migrateAssignments();
