import Knex from "knex";

export async function seed(knex: Knex) {
  await knex("moods").insert([
    { title: "80s", image: "80s.svg" },
    { title: "Blues", image: "blues.svg" },
    { title: "Chilli", image: "chilli.svg" },
    { title: "Funk", image: "funk.svg" },
    { title: "Gospel", image: "gospel.svg" },
    { title: "Jazz", image: "jazz.svg" },
    { title: "Latin", image: "latin.svg" },
    { title: "Metal", image: "metal.svg" },
    { title: "MPB", image: "mpb.svg" },
    { title: "Pop", image: "pop.svg" },
    { title: "Reggae", image: "reggae.svg" },
    { title: "Rock", image: "rock.svg" },
    { title: "Romântico", image: "romantico.svg" },
    { title: "Samba", image: "samba.svg" },
    { title: "Sertanejo", image: "sertanejo.svg" },
  ]);
}
