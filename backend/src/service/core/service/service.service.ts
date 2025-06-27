import { ServiceRepository } from '../../service.repository';
import { CustomErrors } from '../../../libs/CustomErrors';
import { logger } from '../../../infrastructure/logger/logger';

export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async getService() {
    try {
      const services = await this.serviceRepository.getService();

      if (!services.length) {
        throw new CustomErrors('No services found', 404);
      }

      return services;
    } catch (error) {
      if (error instanceof CustomErrors) {
        throw error;
      }
      logger.error('Error in ServiceService.getService:', { error });
      throw new CustomErrors('Failed to process service request', 500);
    }
  }
}
