import 'dotenv/config';
import createApp from '../src/app';
import { connectDB } from '../src/config/db';
import { Request, Response } from 'express';

// Create Express app once (module-level, reused across warm invocations)
const app = createApp();

// Track connection state across warm serverless invocations
let dbConnected = false;

// Vercel serverless function entrypoint
export default async function handler(req: Request, res: Response) {
  try {
    // Connect to DB only once per cold start (cached on warm invocations)
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    // Hand over the request to Express
    return app(req, res);
  } catch (error: any) {
    console.error('Vercel Serverless Error:', error?.message || error);
    res.status(500).json({ success: false, message: 'Internal Serverless Error' });
  }
}
