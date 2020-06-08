import { Request, Response } from "express";
import knex from "../database/connection";

class MoodsController {
  /**
   * Listando todos os moods
   */
  async index(request: Request, response: Response) {
    const moods = await knex("moods").select("*");

    const serializedMoods = moods.map((mood) => {
      return {
        id: mood.id,
        title: mood.title,
        image_url: `http://192.168.1.12:3333/uploads/${mood.image}`,
      };
    });

    return response.json(serializedMoods);
  }
}

export default MoodsController;
