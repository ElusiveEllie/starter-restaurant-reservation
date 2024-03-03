/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validateDate = require("./validateDate");

async function list(req, res) {
  const date = req.query.date;
  const data = await reservationsService.list(date);
  res.json({ data });
}

async function create(req, res, next) {
  const validationErrors = validateDate(
    req.body.data.reservation_date
  );
  if (!validationErrors) {
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
  } else {
    next({ status: 400, message: validationErrors });
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)],
};
