import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("profiles", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("nickname").notNullable();
    table.string("gender").notNullable();
    table.string("orientation").notNullable();
    table.string("whatsapp").notNullable();
    table.decimal("lat").notNullable();
    table.decimal("long").notNullable();
    table.string("city", 2).notNullable();
    table.string("uf", 2).notNullable();
    table.string("spotify_uri").notNullable();
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("profiles");
}
