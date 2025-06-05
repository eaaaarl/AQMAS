import knex from "../database/database";

export class QueerRepository {
  private db = knex;

  async getQueerService() {
    try {
      const service = await this.db("ent_service").select("*");
      return service;
    } catch (error) {
      console.error("Error fetching queer service:", error);
      throw error;
    }
  }
}
