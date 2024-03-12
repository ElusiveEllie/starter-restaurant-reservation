import { searchForReservation as search } from "../utils/api";

async function searchForReservation(formData, setReservationsError, setReservations) {
  const abortController = new AbortController();
  setReservationsError(null);
  await search(formData, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
  return () => abortController.abort();
}

export default searchForReservation;
