import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class VaccineCronService {
  private readonly logger = new Logger(VaccineCronService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleVaccineAlerts() {
    this.logger.log('Ejecutando revisión diaria de vacunas...');
    const result = await this.notificationsService.processVaccineAlerts();
    this.logger.log(`Alertas procesadas: ${result.processed}`);
  }
}
