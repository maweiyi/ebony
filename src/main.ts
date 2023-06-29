import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';
import { WinstonLogger } from './common/loggers/winston.logger';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  const configService = app.get(ConfigService);

  process.on('SIGINT', async () => {
    try {
      await app.close();
      logger.log(
        `App closed and process will exit in ${configService.get(
          'GRACEFUL_SHUTDOWN_TIMEOUT',
        )} ms`,
      );
    } catch (err) {
      logger.error('Error during shutdown', err);
    } finally {
      setTimeout(() => {
        process.exit();
      }, configService.get('GRACEFUL_SHUTDOWN_TIMEOUT'));
    }
  });

  process.on('SIGTERM', async () => {
    try {
      await app.close();
      logger.log(
        `App closed and process will exit in ${configService.get(
          'GRACEFUL_SHUTDOWN_TIMEOUT',
        )} ms`,
      );
    } catch (err) {
      logger.error('Error during shutdown', err);
    } finally {
      setTimeout(() => {
        process.exit();
      }, configService.get('GRACEFUL_SHUTDOWN_TIMEOUT'));
    }
  });

  await app.listen(configService.get('PORT'), () => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}
bootstrap();
