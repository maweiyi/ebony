import { Injectable, LoggerService, Scope } from '@nestjs/common';
import chalk from 'chalk';
import * as winston from 'winston';

import { LogLevels } from '../enums/log.enums';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: LogLevels.INFO,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, context, timestamp }) => {
          let colorizeMessage = message;

          switch (level) {
            case LogLevels.ERROR:
              colorizeMessage = chalk.red(message);
              break;
            case LogLevels.WARN:
              colorizeMessage = chalk.yellow(message);
              break;
            case LogLevels.INFO:
              colorizeMessage = chalk.green(message);
              break;
            case LogLevels.VERBOSE:
              colorizeMessage = chalk.blue(message);
              break;
            case LogLevels.DEBUG:
              colorizeMessage = chalk.magenta(message);
              break;
            case LogLevels.SILLY:
              colorizeMessage = chalk.cyan(message);
              break;
          }

          return `${chalk.green(process.pid)} - ${chalk.gray(
            timestamp,
          )} [${chalk.cyan(context)}] ${colorizeMessage}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/log.log',
          level: LogLevels.INFO,
        }),
      ],
    });
  }
  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
