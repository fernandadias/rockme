import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("profile_moods", (table) => {
    table.increments("id").primary();

    table
      .integer("profile_id")
      .notNullable()
      .references("id")
      .inTable("profiles");
    table.integer("mood_id").notNullable().references("id").inTable("moods");
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("profile_moods");
}
