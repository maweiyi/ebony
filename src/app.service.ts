import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger('AppService');
  getHello(): string {
    throw new HttpException(
      { message: 'Something went wrong', code: 10000 },
      HttpStatus.OK,
    );
  }
}
