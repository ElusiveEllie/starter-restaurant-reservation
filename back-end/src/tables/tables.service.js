const knex = require("../db/connection");

/**
 * Retrieves a list of all tables ordered by table name.
 * @returns {Promise<Array>} A promise that resolves to an array of table objects.
 */

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

/**
 * Retrieves a table with the specified table ID.
 * @param {number} table_id - The ID of the table to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the table object.
 */

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

/**
 * Retrieves a single reservation by its ID.
 * @param {string} reservation_id - The ID of the reservation to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved reservation object.
 */

function readReservation(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

/**
 * Updates the table with the provided data, and if the reservation associated with the table is not already seated,
 * updates the reservation status to "seated". Rolls back if any errors are encountered.
 * @param {Object} updatedTable - The updated table data including the reservation ID.
 * @returns {Promise} A promise representing the completion of the update operation.
 */

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

/**
 * Retrieves the table with the specified ID after it has been updated.
 * @param {string} table_id - The ID of the table to retrieve.
 * @returns {Promise} A promise that resolves to the updated table data.
 */

function readAfterUpdate(table_id) {
  return knex("tables as t").select("*").where({ table_id: table_id }).first();
}

/**
 * Creates a new table in the database.
 * @param {Object} table - The table object containing the data for the new table.
 * @returns {Promise} A promise that resolves to the newly created table data.
 */

function create(table) {
  return knex("tables").insert([table]).returning("*");
}

/**
 * Marks a table as finished and removes the associated reservation.
 * Rolls back if any errors occur.
 * @param {Object} table - The table object containing the data for the finished table.
 * @returns {Promise} A promise that resolves when the table and reservation updates are committed.
 */

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
