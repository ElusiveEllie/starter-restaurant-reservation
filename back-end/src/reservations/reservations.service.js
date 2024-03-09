const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({reservation_date: date})
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": reservation_id })
    .first();
}

function create(reservation) {
  return knex("reservations")
    .insert([reservation])
    .returning("*");
}

module.exports = {
  list,
  create,
  read,
}