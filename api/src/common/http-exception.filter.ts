import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ConsistentExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        return res.status(status).json({ code: 'HTTP_ERROR', message: body });
      }
      const obj = body as Record<string, unknown>;
      return res.status(status).json({
        code: obj.code ?? 'HTTP_ERROR',
        message: obj.message ?? 'Error',
        details: obj.details ?? obj,
      });
    }

    console.error(exception);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_ERROR',
      message: 'Error interno',
    });
  }
}
