import { QueerRepository } from "../../queer.repository";

export class QueerService {
  constructor(private readonly queerRepository: QueerRepository) {}

  async getQueerService() {
    try {
      const service = await this.queerRepository.getQueerService();
      return service;
    } catch (error) {
      console.error("Error fetching queer service:", error);
      throw error;
    }
  }
}
