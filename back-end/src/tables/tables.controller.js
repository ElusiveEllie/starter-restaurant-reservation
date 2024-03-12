const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "table_name",
  "capacity"
);

const VALID_PROPERTIES = [
  "table_name",
  "capacity"
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function create(req, res) {
  let  data = await tablesService.create(req.body.data);
  data = data[0];
  res.status(201).json({ data });
}

async function reservationExists(req, res, next) {
  const table_id = req.params.tableId;
  const reservation = await tablesService.readReservation(req.body.data.reservation_id);
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

async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  if (res.locals.reservation.people > res.locals.table.capacity) {
    return next({
      status: 400,
      message: `Reservation is for more guests than table capacity can seat.`,
    })
  }
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table is currently occupied.`,
    })
  }
  await tablesService.update(updatedTable);
  next();
}

async function readUpdate(req, res, next) {
  let data = await tablesService.readAfterUpdate(res.locals.table.table_id);
  data = data[0];
  res.json({ data });
}

async function tableExists(req, res, next) {
  const table_id = req.params.tableId;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

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
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
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
