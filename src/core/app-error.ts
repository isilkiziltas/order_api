export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Kayıt bulunamadı') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Geçersiz istek parametreleri') {
    super(message, 400);
  }
}