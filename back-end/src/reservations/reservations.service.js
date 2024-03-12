const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

function listByNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

function create(reservation) {
  return knex("reservations").insert([reservation]).returning("*");
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation);
}

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
