// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import * as changeCase from 'change-case';
import { convertToSnakeKeys } from '../helpers/convertToSnakeKeys';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        const message =
          this.reflector.get<string>(
            'response_message',
            context.getHandler(),
          ) || 'Request successful';
        const plainData = JSON.parse(JSON.stringify(data));

        const customData = {
          statusCode: response.statusCode,
          message,
          data: plainData,
          timestamp: new Date().toISOString(),
        };

        return convertToSnakeKeys(customData);
      }),
    );
  }
}
