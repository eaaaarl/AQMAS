import { ServiceRepository } from '../../service.repository';

export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async getService() {
    try {
      const service = await this.serviceRepository.getService();
      return service;
    } catch (error) {
      console.error('Error fetching queer service:', error);
      throw error;
    }
  }
}
