const knex = require("../db/connection");

/**
 * Retrieves a list of reservations for a specific date.
 * @param {string} date - The date for which reservations are to be retrieved.
 * @returns {Promise<Array>} - A promise that resolves to an array of reservation objects.
 */

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

/**
 * Retrieves a list of reservations associated with a specific mobile number.
 * @param {string} mobile_number - The mobile number for which reservations are to be retrieved.
 * @returns {Promise<Array>} - A promise that resolves to an array of reservation objects.
 */

function listByNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

/**
 * Retrieves a single reservation by its ID.
 * @param {string} reservation_id - The ID of the reservation to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved reservation object.
 */

function read(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

/**
 * Creates a new reservation.
 * @param {Object} reservation - The reservation object to be created.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the created reservation object.
 */

function create(reservation) {
  return knex("reservations").insert([reservation]).returning("*");
}

/**
 * Updates an existing reservation.
 * @param {Object} updatedReservation - The updated reservation object.
 * @returns {Promise<number>} - A promise that resolves to the number of updated rows.
 */

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation);
}

/**
 * Retrieves a reservation after it has been updated.
 * @param {string} reservation_id - The ID of the updated reservation.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved reservation object.
 */

function readAfterUpdate(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

module.exports = {
  list,
  listByNumber,
  create,
  read,
  update,
  readAfterUpdate,
};
