// Augments Express's Request interface to include the authenticated user payload
declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      role: string;
      email: string;
    };
  }
}
