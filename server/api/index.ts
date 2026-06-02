import createApp from '../src/app';
import { connectDB } from '../src/config/db';
import { Request, Response } from 'express';
import { logger } from '../src/config/logger';

// Create Express app
const app = createApp();

let dbConnected = false;

// Vercel serverless function entrypoint
export default async function handler(req: Request, res: Response) {
  try {
    if (!dbConnected) {
      logger.info('Connecting to MongoDB for serverless function...');
      await connectDB();
      dbConnected = true;
    }
    
    // Hand over the request to Express
    return app(req, res);
  } catch (error) {
    logger.error('Vercel Serverless Error:', error);
    res.status(500).json({ success: false, message: 'Internal Serverless Error' });
  }
}
