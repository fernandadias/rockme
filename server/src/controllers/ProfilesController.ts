import { Request, Response } from "express";
import knex from "../database/connection";

class ProfilesController {
  /**
   * Buscando profile filtrando pela cidade, UF e estilos
   */
  async index(request: Request, response: Response) {
    const { city, uf, moods } = request.query;

    const parsedMoods = String(moods)
      .split(",")
      .map((mood) => Number(mood.trim()));

    const profiles = await knex("profiles")
      .join("profile_moods", "profiles.id", "=", "profile_moods.profile_id")
      .whereIn("profile_moods.mood_id", parsedMoods)
      .where("uf", String(uf))
      .distinct()
      .select("profiles.*");

    const serializedProfiles = profiles.map((profile) => {
      return {
        ...profile,
        image_url: `http://192.168.1.12:3333/uploads/${profile.image}`,
      };
    });

    return response.json(serializedProfiles);
  }

  /**
   * Buscando profile pelo id
   */
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const profile = await knex("profiles").where("id", id).first();

    if (!profile) {
      return response.status(400).json({ message: "profile not found" });
    }

    const serializedProfile = {
      ...profile,
      image_url: `http://192.168.1.12:3333/uploads/${profile.image}`,
    };

    const moods = await knex("moods")
      .join("profile_moods", "moods.id", "=", "profile_moods.mood_id")
      .where("profile_moods.profile_id", id)
      .select("moods.title");

    return response.json({ profile: serializedProfile, moods });
  }

  /**
   * Criando um novo profile
   */
  async create(request: Request, response: Response) {
    const {
      name,
      nickname,
      gender,
      orientation,
      whatsapp,
      lat,
      long,
      city,
      uf,
      spotify_uri,
      moods,
    } = request.body;

    const trx = await knex.transaction();

    const profile = {
      image: request.file.filename,
      name,
      nickname,
      gender,
      orientation,
      whatsapp,
      lat,
      long,
      city,
      uf,
      spotify_uri,
    };

    const insertedIds = await trx("profiles").insert(profile);

    const profile_id = insertedIds[0];

    const profileMoods = moods
      .split(",")
      .map((mood: string) => Number(mood.trim()))
      .map((mood_id: number) => {
        return {
          mood_id,
          profile_id: profile_id,
        };
      });

    await trx("profile_moods").insert(profileMoods);

    trx.commit();

    return response.json({
      id: profile_id,
      ...profile,
    });
  }
}

export default ProfilesController;
