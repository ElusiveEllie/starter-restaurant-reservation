import { putSeatingAssignment } from "../utils/api";

/**
 * Sets the seating assignment for a reservation.
 * @param {Object} formData - The seating assignment data.
 * @param {Function} setSeatingError - A function to set errors related to seating assignment.
 * @param {Object} history - The history object to navigate after setting the seating assignment.
 * @returns {Function} - A cleanup function to abort any pending requests.
 */

function setReservationSeat(formData, setSeatingError, history) {
  const abortController = new AbortController();
  setSeatingError(null);
  formData.status = "seated";
  putSeatingAssignment(formData, abortController.signal)
    .then(() => history.push(`/dashboard`))
    .catch(setSeatingError);
  return () => abortController.abort();
}

export default setReservationSeat;
