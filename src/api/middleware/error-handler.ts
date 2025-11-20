/**
 * Error handling middleware
 */

export interface APIError {
  statusCode: number;
  message: string;
  code: string;
  details?: unknown;
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = "NOT_FOUND";
}

export class ValidationError extends Error {
  statusCode = 400;
  code = "VALIDATION_ERROR";
  details: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  code = "CONFLICT";
}

export class InternalServerError extends Error {
  statusCode = 500;
  code = "INTERNAL_SERVER_ERROR";
}

export function errorHandler(error: Error): APIError {
  // TODO: Implement error transformation
  // - Map known errors to appropriate status codes
  // - Log errors with context
  // - Sanitize error messages for production
  // - Return standardized error format

  if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      message: error.message,
      code: "NOT_FOUND",
    };
  }

  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      message: error.message,
      code: "VALIDATION_ERROR",
      details: error.details,
    };
  }

  // Default to 500
  return {
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  };
}
