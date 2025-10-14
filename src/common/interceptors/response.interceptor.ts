import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        status: response.statusCode,
        message: this.getMessage(context),
        data,
      })),
    );
  }

  private getMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    switch (method) {
      case 'POST':
        return 'Created successfully';
      case 'GET':
        return 'Fetched successfully';
      case 'PATCH':
      case 'PUT':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Request successful';
    }
  }
}
