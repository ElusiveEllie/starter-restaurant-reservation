/**
 * Creates an error boundary for asynchronous middleware functions.
 * @param {Function} delegate - The asynchronous middleware function to be wrapped.
 * @param {number} defaultStatus - The default HTTP status code to use for errors.
 * @returns {Function} - An error-handling middleware function.
 */

function asyncErrorBoundary(delegate, defaultStatus) {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => delegate(req, res, next))
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
