import { postReservation as post } from "../utils/api";

/**
 * Posts a new reservation.
 * @param {Object} formData - The reservation data to be posted.
 * @param {Function} setReservationsError - A function to set errors related to reservations.
 * @param {Object} history - The history object to navigate after posting the reservation.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

function postReservation(formData, setReservationsError, history) {
  const abortController = new AbortController();
  setReservationsError(null);
  post({ data: formData }, abortController.signal)
    .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
    .catch(setReservationsError);
  return () => abortController.abort();
}

export default postReservation;
