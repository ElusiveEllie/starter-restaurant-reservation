/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validation = require("./validation");

async function list(req, res) {
  const date = req.query.date;
  const data = await reservationsService.list(date);
  res.json({ data });
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
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
  } else {
    validationErrors = validationErrors.join("\n");
    next({ status: 400, message: validationErrors });
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)],
};
