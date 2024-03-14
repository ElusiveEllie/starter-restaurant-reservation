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

  // Return 400 with invalid status message if status is "seated" or "finished"
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: `Invalid status: ${data.status}`,
    });
  }
  next();
}

/**
 * Retrieves a list of reservations.
 */
async function list(req, res, next) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (mobile_number) {
    // If phone number is included with query, search for only reservations matching phone number
    let data = await reservationsService.listByNumber(mobile_number);
    data = data.filter((reservation) => reservation.status !== "finished");
    res.json({ data });
  } else {
    // Otherwise, Search for all reservations on indicated date
    let data = await reservationsService.list(date);
    // Filter out reservations with status "finished"
    data = data.filter((reservation) => reservation.status !== "finished");
    res.json({ data });
  }
}

/**
 * Checks if a reservation with the given ID exists.
 */

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

/**
 * Sends the details of a reservation as a JSON response.
 */

async function read(req, res, next) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

/**
 * Creates a new reservation if the provided data passes validation.
 */

async function create(req, res, next) {
  let validationErrors = [];
  const date = req.body.data.reservation_date;
  const time = req.body.data.reservation_time;

  // Validate date and time
  const dateErrors = validation.validateDate(date);
  const timeErrors = validation.validateTime(date, time);

  if (dateErrors) validationErrors.push(dateErrors);
  if (timeErrors) validationErrors.push(timeErrors);

  if (!validationErrors.length) {
    let data = await reservationsService.create(req.body.data);
    data = data[0];
    res.status(201).json({ data });
  } else {
    // Send validation errors as a 400 response
    validationErrors = validationErrors.join("\n");
    next({ status: 400, message: validationErrors });
  }
}

/**
 * Updates a reservation if the provided data passes validation.
 */

async function update(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  let validationErrors = [];

  if (updatedReservation.status !== "cancelled") {
    // Validate date and time if reservation is not cancelled
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
    // Send validation errors as a 400 response
    validationErrors = validationErrors.join("\n");
    next({ status: 400, message: validationErrors });
  }
}

/**
 * Updates the status of a reservation.
 */

async function updateStatus(req, res, next) {
  // Check if the reservation status is valid for update
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

  // Check if the updated status is valid
  if (!VALID_STATUSES.includes(updatedReservation.status)) {
    return next({
      status: 400,
      message: `Invalid status: ${updatedReservation.status}`,
    });
  }

  await reservationsService.update(updatedReservation);
  next();
}

/**
 * Reads the updated information of a reservation.
 */

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
