export class ApiError extends Error {
  public statusCode: number;
  public success: false;
  public errors: unknown[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    stack?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /** 400 Bad Request */
  static badRequest(message: string, errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  /** 401 Unauthorized */
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /** 403 Forbidden */
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  /** 404 Not Found */
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  /** 409 Conflict */
  static conflict(message: string) {
    return new ApiError(409, message);
  }

  /** 422 Unprocessable Entity */
  static unprocessable(message: string, errors: unknown[] = []) {
    return new ApiError(422, message, errors);
  }

  /** 429 Too Many Requests */
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  /** 500 Internal Server Error */
  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}
