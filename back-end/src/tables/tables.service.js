const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable);
}

function readAfterUpdate(table_id) {
  return knex("tables as t")
    .select("*")
    .where({ table_id: table_id })
    .first();
}

function create(table) {
  return knex("tables").insert([table]).returning("*");
}

module.exports = {
  list,
  create,
  read,
  update,
  readAfterUpdate,
};
