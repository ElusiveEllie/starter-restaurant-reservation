import { putReservation as put } from "../utils/api";

/**
 * Updates an existing reservation.
 * @param {Object} formData - The reservation data to be updated.
 * @param {Function} setReservationsError - A function to set errors related to reservations.
 * @param {Object} history - The history object to navigate after updating the reservation.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

function putReservation(formData, setReservationsError, history) {
  const abortController = new AbortController();
  setReservationsError(null);
  put({ data: formData }, abortController.signal)
    .then(() => history.goBack())
    .catch(setReservationsError);
  return () => abortController.abort();
}

export default putReservation;
