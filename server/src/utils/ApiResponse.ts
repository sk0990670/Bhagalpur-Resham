export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T | null;
  public meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    data: T | null = null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: any,
  ) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  /** Shorthand helpers */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static ok<T>(message: string, data: T | null = null, meta?: any) {
    return new ApiResponse<T>(200, message, data, meta);
  }

  static created<T>(message: string, data: T | null = null) {
    return new ApiResponse<T>(201, message, data);
  }

  static noContent(message = 'Success') {
    return new ApiResponse(204, message);
  }
}
