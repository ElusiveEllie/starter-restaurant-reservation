import { searchForReservation as search } from "../utils/api";

/**
 * Searches for reservations based on provided mobile number.
 * @param {Object} formData - The form data used for searching reservations.
 * @param {Function} setReservationsError - A function to set errors related to reservations.
 * @param {Function} setReservations - A function to set the search results for reservations.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

async function searchForReservation(
  formData,
  setReservationsError,
  setReservations
) {
  const abortController = new AbortController();
  setReservationsError(null);
  await search(formData, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
  return () => abortController.abort();
}

export default searchForReservation;
