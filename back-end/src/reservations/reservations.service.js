const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({reservation_date: date})
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert([reservation.reservation.data])
    .returning("*");
}

module.exports = {
  list,
  create,
}