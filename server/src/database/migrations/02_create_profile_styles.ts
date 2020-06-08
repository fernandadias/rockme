import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("profile_styles", (table) => {
    table.increments("id").primary();

    table
      .integer("profile_id")
      .notNullable()
      .references("id")
      .inTable("profiles");
    table.integer("style_id").notNullable().references("id").inTable("styles");
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("profile_styles");
}
