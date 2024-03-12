const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

function update(updatedTable) {
  return knex.transaction(async function (trx) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id: updatedTable.reservation_id })
      .first()
      .then((data) => {
        if (data.status === "seated") {
          const error = new Error("Reservation is already seated.");
          error.status = 400;
          throw error;
        }
        return knex("tables")
          .select("*")
          .where({ table_id: updatedTable.table_id })
          .update(updatedTable)
          .transacting(trx)
          .then(() => {
            return knex("reservations")
              .select("*")
              .where({ reservation_id: updatedTable.reservation_id })
              .then(() => {
                return knex("reservations")
                  .select("*")
                  .where({ reservation_id: updatedTable.reservation_id })
                  .update({ status: "seated" });
              });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback)
      .catch((e) => e);
  });
}

function readAfterUpdate(table_id) {
  return knex("tables as t").select("*").where({ table_id: table_id }).first();
}

function create(table) {
  return knex("tables").insert([table]).returning("*");
}

function finishReservation(table) {
  return knex.transaction(function (trx) {
    return knex("tables")
      .where({ table_id: table.table_id })
      .update({ reservation_id: null }, ["table_id", "reservation_id"])
      .then(() => {
        return knex("reservations")
        .select("*")
        .where({ reservation_id: table.reservation_id })
        .update({ status: "finished" });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

module.exports = {
  list,
  create,
  read,
  readReservation,
  update,
  readAfterUpdate,
  finishReservation,
};
