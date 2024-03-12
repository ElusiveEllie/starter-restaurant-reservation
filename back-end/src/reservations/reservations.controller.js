/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validation = require("./validation");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];

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

  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: `Invalid status: ${data.status}`,
    });
  }
  next();
}

async function list(req, res, next) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (mobile_number) {
    let data = await reservationsService.listByNumber(mobile_number);
    data = data.filter((reservation) => reservation.status !== "finished");
    res.json({ data });
  } else {
    let data = await reservationsService.list(date);
    data = data.filter((reservation) => reservation.status !== "finished");
    res.json({ data });
  }
}

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} cannot be found.`,
  });
}

async function read(req, res, next) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

async function create(req, res, next) {
  let validationErrors = [];
  const date = req.body.data.reservation_date;
  const time = req.body.data.reservation_time;
  const dateErrors = validation.validateDate(date);
  const timeErrors = validation.validateTime(date, time);
  if (dateErrors) validationErrors.push(dateErrors);
  if (timeErrors) validationErrors.push(timeErrors);
  if (!validationErrors.length) {
    let data = await reservationsService.create(req.body.data);
    data = data[0];
    res.status(201).json({ data });
  } else {
    validationErrors = validationErrors.join("\n");
    next({ status: 400, message: validationErrors });
  }
}

async function update(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  let validationErrors = [];
  if (updatedReservation.status !== "cancelled") {
    const date = updatedReservation.reservation_date;
    const time = updatedReservation.reservation_time;
    const dateErrors = validation.validateDate(date);
    const timeErrors = validation.validateTime(date, time);
    if (dateErrors) validationErrors.push(dateErrors);
    if (timeErrors) validationErrors.push(timeErrors);
  }

  if (!validationErrors.length) {
    if (!VALID_STATUSES.includes(req.body.data.status)) {
      return next({
        status: 400,
        message: `Invalid status: ${req.body.data.status}`,
      });
    }

    if (res.locals.reservation.status === "finished") {
      return next({
        status: 400,
        message: `A finished reservation cannot be updated.`,
      });
    }

    await reservationsService.update(updatedReservation);
    next();
  } else {
    validationErrors = validationErrors.join("\n");
    next({ status: 400, message: validationErrors });
  }
}

async function updateStatus(req, res, next) {
  if (
    res.locals.reservation.status === "seated" ||
    res.locals.reservation.status === "finished"
  ) {
    return next({
      status: 400,
      message: `Invalid status: ${res.locals.reservation.status}`,
    });
  }
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  if (!VALID_STATUSES.includes(updatedReservation.status)) {
    return next({
      status: 400,
      message: `Invalid status: ${updatedReservation.status}`,
    });
  }

  await reservationsService.update(updatedReservation);
  next();
}

async function readUpdate(req, res, next) {
  let data = await reservationsService.readAfterUpdate(
    res.locals.reservation.reservation_id
  );
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasRequiredProperties,
    hasOnlyValidProperties,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
    asyncErrorBoundary(readUpdate),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
    asyncErrorBoundary(readUpdate),
  ],
};
