/**
 * Creates a middleware function that validates that req.body.data has the specified non-falsey properties.
 * @param properties
 *  one or more property name strings.
 * @returns {function(*, *, *): void}
 *    a middleware function that validates that req.body.data has the specified non-falsey properties.
 */
function hasProperties(...properties) {
  return function (res, req, next) {
    const { data = {} } = res.body;

    try {
      properties.forEach((property) => {
        const value = data[property];
        if (!value) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
        if (property === "reservation_date") {
          if (!/([\d\d\d\d-\d\d-\d\d]{10,})$/.test(value)) {
            const error = new Error(`The ${property} must be a valid date.`);
            error.status = 400;
            throw error;
          }
        } else if (property === "reservation_time") {
          if (!/([\d\d:\d\d]{5,})$/.test(value)) {
            const error = new Error(`The ${property} must be a valid time.`);
            error.status = 400;
            throw error;
          }
        } else if (property === "people" || property === "capacity") {
          if (typeof value !== "number") {
            const error = new Error(
              `The number of ${property} must be a number.`
            );
            error.status = 400;
            throw error;
          }
        } else if (property === "table_name") {
          if (value.length <= 1) {
            const error = new Error(
              `The ${property}' must be at least 2 characters long.`
            );
            error.status = 400;
            throw error;
          }
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
