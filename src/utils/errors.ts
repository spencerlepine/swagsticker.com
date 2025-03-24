import logger from '@/lib/logger';
import { RouteContext, RouteHandler } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export class UserError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UserError';
    this.status = status;
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

export class AuthError extends Error {
  status: number;
  constructor(message = 'You don’t have permission to access this resource.', status = 403) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

export const handleApiError = (error: unknown, message = 'Internal Server Error') => {
  logger.error(`${message}:`, error);

  if (error instanceof UserError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { details: errorMessage }),
    },
    { status: 500 }
  );
};

export const withErrorHandler = (handler: RouteHandler) =>
  async (request: NextRequest, context: RouteContext) => {
    try {
      return await handler(request, context);
    } catch (error: unknown) {
      return handleApiError(error);
    }
  };
