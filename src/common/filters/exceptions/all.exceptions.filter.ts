import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from 'src/common/enums/response.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ResponseCode.SERVICE_UNAVAILABLE;

    const message =
      exception instanceof HttpException
        ? exception.message
        : ResponseMessage.SERVICE_UNAVAILABLE;

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
