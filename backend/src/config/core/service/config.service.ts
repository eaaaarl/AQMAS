import { ConfigRepository } from '../../config.repository';

export class ConfigService {
  constructor(private readonly configRepository: ConfigRepository) {}

  async getAllConfig() {
    const configs = await this.configRepository.getAllConfig();

    return configs;
  }
}
