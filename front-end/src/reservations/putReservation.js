import { putReservation as put } from "../utils/api";

function putReservation(formData, setReservationsError, history) {
  const abortController = new AbortController();
  setReservationsError(null);
  put({ data: formData }, abortController.signal)
    .then(() => history.goBack())
    .catch(setReservationsError);
  return () => abortController.abort();
};

export default putReservation;