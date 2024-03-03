import { postReservation as post } from "../utils/api";

function postReservation(formData, setReservationsError, history) {
  const abortController = new AbortController();
  setReservationsError(null);
  post({ data: formData }, abortController.signal)
    .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
    .catch(setReservationsError);
  return () => abortController.abort();
};

export default postReservation;