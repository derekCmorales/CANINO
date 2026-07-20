import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WhatsAppMessage {
  to: string;
  ownerName: string;
  dogName: string;
  vaccineName: string;
  scheduledDate: string;
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendVaccineReminder(message: WhatsAppMessage): Promise<{ status: 'mock' | 'sent' | 'failed'; externalId?: string; error?: string }> {
    const isMock = this.configService.get<string>('WHATSAPP_MOCK', 'true') === 'true';

    const text =
      `Hola ${message.ownerName}, te recordamos que la vacuna ${message.vaccineName} de ${message.dogName} ` +
      `está programada para el ${message.scheduledDate}. Portal Canino 🐾`;

    if (isMock) {
      this.logger.log(`[WHATSAPP MOCK] Para: ${message.to} | ${text}`);
      return { status: 'mock', externalId: `mock-${Date.now()}` };
    }

    const token = this.configService.get<string>('WHATSAPP_TOKEN');
    const phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneNumberId) {
      this.logger.warn('Credenciales de WhatsApp no configuradas');
      return { status: 'failed', error: 'Credenciales de WhatsApp no configuradas' };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: message.to.replace(/\D/g, ''),
            type: 'text',
            text: { body: text },
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Error WhatsApp API: ${errorBody}`);
        return { status: 'failed', error: errorBody };
      }

      const data = (await response.json()) as { messages?: Array<{ id: string }> };
      return { status: 'sent', externalId: data.messages?.[0]?.id };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Fallo envío WhatsApp: ${message}`);
      return { status: 'failed', error: message };
    }
  }
}
