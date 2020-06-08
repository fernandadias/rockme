import Knex from "knex";

// Seed só para agilizar o desenvolvimento (:
export async function seed(knex: Knex) {
  await knex("profiles").insert([
    {
      image: "avatar01.png",
      name: "Erick Martin da Cruz",
      nickname: "Martins",
      gender: "Homem trans",
      orientation: "Pansexual",
      whatsapp: "55555555",
      lat: "-23.534821",
      long: "-46.5217692",
      city: "São Paulo",
      uf: "SP",
      spotify_uri: "spotify:track:5wMrWkvLD4TnTFwclqgjo6",
    },
    {
      image: "avatar02.png",
      name: "Mariana Marlene Ana Castro",
      nickname: "Mari",
      gender: "Mulher cis",
      orientation: "Heterossexual",
      whatsapp: "55555555",
      lat: "-23.5350088",
      long: "-46.5216297",
      city: "São Paulo",
      uf: "SP",
      spotify_uri: "spotify:track:5wMrWkvLD4TnTFwclqgjo6",
    },
    {
      image: "avatar01.png",
      name: "Giovanni Eduardo Danilo Ferreira",
      nickname: "Dani",
      gender: "Homem cis",
      orientation: "Homossexual",
      whatsapp: "55555555",
      lat: "-23.5350088",
      long: "-46.5216297",
      city: "São Paulo",
      uf: "SP",
      spotify_uri: "spotify:track:5wMrWkvLD4TnTFwclqgjo6",
    },
    {
      image: "avatar02.png",
      name: "Carolina Nascimento",
      nickname: "Carolz",
      gender: "Não binário",
      orientation: "Pansexual",
      whatsapp: "55555555",
      lat: "-23.5350088",
      long: "-46.5216297",
      city: "São Paulo",
      uf: "SP",
      spotify_uri: "spotify:track:5wMrWkvLD4TnTFwclqgjo6",
    },
  ]);
}
