import knex from "../database/database";

export class ServiceRepository {
  private db = knex;

  async getService() {
    try {
      const service = await this.db("ent_service").select("*");
      return service;
    } catch (error) {
      console.error("Error fetching queer service:", error);
      throw error;
    }
  }
}
