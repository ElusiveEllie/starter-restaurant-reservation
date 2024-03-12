exports.up = function (knex) {
  return knex.schema.raw(
    "CREATE TYPE status AS ENUM ('booked', 'seated', 'finished', 'cancelled'); ALTER TABLE reservations ADD COLUMN IF NOT EXISTS status status NOT NULL DEFAULT 'booked';"
  );
};

exports.down = function (knex) {
  return knex.schema.raw(
    "ALTER TABLE IF EXISTS reservations DROP COLUMN IF EXISTS status CASCADE; DROP TYPE IF EXISTS status CASCADE;"
  );
};
