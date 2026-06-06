import { Request, Response } from 'express';

let app: any;
let dbConnected = false;

export default async function handler(req: Request, res: Response) {
  try {
    if (!app) {
      // Dynamically import to catch initialization errors on Vercel
      await import('dotenv/config');
      const { default: createApp } = await import('../src/app');
      app = createApp();
    }

    if (!dbConnected) {
      const { connectDB } = await import('../src/config/db');
      await connectDB();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error: any) {
    console.error('CRITICAL VERCEL ERROR:', error);
    return res.status(500).json({
      success: false,
      error: 'Vercel Serverless Crash',
      message: error?.message || String(error),
      stack: error?.stack
    });
  }
}
