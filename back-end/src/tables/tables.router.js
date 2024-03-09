const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:tableId/seat")
  .put(controller.update)
  .delete(controller.finish)
  .all(methodNotAllowed);

module.exports = router;
