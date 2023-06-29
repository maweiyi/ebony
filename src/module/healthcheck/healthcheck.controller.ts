import { Controller, Head } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthcheckController {
  constructor(private health: HealthCheckService) {}

  @Head()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
