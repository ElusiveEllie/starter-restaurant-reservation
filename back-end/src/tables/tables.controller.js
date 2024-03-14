const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

/**
 * Validates request body properties against a predefined list of valid properties and statuses.
 */

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  // Find invalid fields
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  // Return 400 with invalid fields message if any invalid fields found
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

/**
 * Retrieves a list of tables.
 */

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

/**
 * Creates a new table.
 */

async function create(req, res) {
  let data = await tablesService.create(req.body.data);
  data = data[0];
  res.status(201).json({ data });
}

/**
 * Checks if a reservation with the given ID exists.
 */

async function reservationExists(req, res, next) {
  const table_id = req.params.tableId;
  const reservation = await tablesService.readReservation(
    req.body.data.reservation_id
  );
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
  }
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.body.data.reservation_id} cannot be found.`,
  });
}

/**
 * Updates a table with new information and forwards the request to the next middleware.
 * Checks if the updated table can accommodate the reservation's number of guests and if it's currently occupied.
 */

async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  // Check if the reservation's number of guests exceeds the table's capacity
  if (res.locals.reservation.people > res.locals.table.capacity) {
    return next({
      status: 400,
      message: `Reservation is for more guests than table capacity can seat.`,
    });
  }

  // Check if the table is currently occupied
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table is currently occupied.`,
    });
  }
  await tablesService.update(updatedTable);
  next();
}

/**
 * Reads the updated information of a table.
 */

async function readUpdate(req, res, next) {
  let data = await tablesService.readAfterUpdate(res.locals.table.table_id);
  data = data[0];
  res.json({ data });
}

/**
 * Checks if a table with the given ID exists.
 */

async function tableExists(req, res, next) {
  const table_id = req.params.tableId;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

/**
 * Finishes a reservation associated with a table if the table is occupied,
 * otherwise, returns a 400 error indicating that the table is not occupied.
 */

async function finishReservation(req, res, next) {
  const isOccupied = res.locals.table.reservation_id;
  if (isOccupied) {
    await tablesService.finishReservation(res.locals.table);
    return next();
  }
  next({ status: 400, message: "Table is not occupied." });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
    asyncErrorBoundary(readUpdate),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(finishReservation),
    asyncErrorBoundary(readUpdate),
  ],
};
